import { JwtService } from '@nestjs/jwt';
import { TJWTPayload } from '@root/src/auth/payload/jwt.payload';
import { TAuthLoginToken } from '@root/src/auth/types/auth-login-token.type';
import { LoginRequestDTO } from '@src/auth/dto/login-request.dto';
import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountService } from '@src/account/service/account.service';
import { compare, hash } from 'bcrypt';
import { AUTH_CONFIG_TOKEN, TAuthConfig } from '@config/auth.config';
import { RegisterRequestDTO } from '@src/auth/dto/register-request.dto';
import { Account } from '@src/account/entity/account.entity';
import { createHash } from 'crypto';
import { AuthenticatedAccountPayloadFactory } from '@src/auth/factory/authenticated-account-payload.factory';
import { AuthenticatedAccountPayload } from '@src/auth/payload/authenticated-account.payload';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_CONFIG_TOKEN) private readonly authConfig: TAuthConfig,
    private readonly accountService: AccountService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateAccount(
    payload: TJWTPayload,
  ): Promise<AuthenticatedAccountPayload | null> {
    const account = await this.accountService.getAccountByEmailAddress(
      payload.email,
    );

    if (!account || account.id !== payload.id) {
      Logger.debug(
        `Account not found for email: ${payload.email} and id: ${payload.id}`,
        AuthService.name,
      );

      return null;
    }

    const isStateHashValid = this.isStateHashValid(account, payload.stateHash);
    if (!isStateHashValid) {
      Logger.debug(
        `State hash mismatch for account: ${account.email.address}`,
        AuthService.name,
      );
      return null;
    }

    return AuthenticatedAccountPayloadFactory.fromAccount(account);
  }

  public async login(loginRequest: LoginRequestDTO): Promise<TAuthLoginToken> {
    const account = await this.accountService.getAccountByEmailAddress(
      loginRequest.email,
    );

    if (!account) {
      Logger.debug(
        `Account not found for email: ${loginRequest.email}!`,
        AuthService.name,
      );
      throw new UnauthorizedException('Unauthorized');
    }

    const isPasswordValid = await this.comparePassword(
      loginRequest.password,
      account.hashedPassword,
    );

    if (!isPasswordValid) {
      Logger.debug(
        `Invalid password for email: ${loginRequest.email}!`,
        AuthService.name,
      );
      throw new UnauthorizedException('Unauthorized');
    }

    Logger.debug(
      `Login successful for email: ${loginRequest.email}`,
      AuthService.name,
    );

    return {
      access_token: await this.issueJwtToken(account),
    };
  }

  public async registerAccount(
    registerRequest: RegisterRequestDTO,
  ): Promise<TAuthLoginToken> {
    const account = await this.accountService.getAccountByEmailAddress(
      registerRequest.email,
    );

    if (account) {
      Logger.debug(
        `Account already exists for email: ${registerRequest.email}`,
        AuthService.name,
      );
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashPassword(registerRequest.password);

    const createdAccount = await this.accountService.createAccount(
      registerRequest.email,
      hashedPassword,
    );

    Logger.debug(
      `Created account for email: ${registerRequest.email}`,
      AuthService.name,
    );

    return {
      access_token: await this.issueJwtToken(createdAccount),
    };
  }

  private isStateHashValid(account: Account, stateHash: string): boolean {
    const generatedStateHash = this.generateStateHash(account);
    return stateHash === generatedStateHash;
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    Logger.debug(`Comparing password for account!`, AuthService.name);
    return compare(plainPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    Logger.debug(`Hashing password for account!`, AuthService.name);
    return hash(password, this.authConfig.saltRounds);
  }

  private async issueJwtToken(account: Account): Promise<string> {
    const payload: TJWTPayload = {
      id: account.id,
      email: account.email.address,
      stateHash: this.generateStateHash(account),
    };

    Logger.debug(
      `Issuing JWT token for account: ${payload.email}`,
      AuthService.name,
    );

    return this.jwtService.sign(payload);
  }

  private generateStateHash(account: Account): string {
    const state = `${
      account.id
    }${account.email.updatedAt.toISOString()}${account.lastPasswordChangedAt.toISOString()}`;

    Logger.debug(
      `Generating state hash for account: ${account.email.address}`,
      AuthService.name,
    );

    return createHash('sha256').update(state).digest('hex');
  }
}
