import { Account } from '@src/account/entity/account.entity';
import { TJWTPayload } from '@src/auth/payload/jwt.payload';

export class JWTPayloadFactory {
  public static fromAccount(account: Account, stateHash: string): TJWTPayload {
    return {
      id: account.id,
      email: account.email.address,
      stateHash,
    };
  }
}
