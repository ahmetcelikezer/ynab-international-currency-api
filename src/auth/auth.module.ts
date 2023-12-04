import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AUTH_CONFIG_TOKEN, TAuthConfig } from '@config/auth.config';
import { AuthController } from '@src/auth/controller/auth.controller';
import { AuthService } from '@src/auth/service/auth.service';
import { JwtSrategy } from '@src/auth/strategy/jwt.strategy';
import { AccountModule } from '@src/account/account.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const authConfig: TAuthConfig | undefined =
          configService.get<TAuthConfig>(AUTH_CONFIG_TOKEN.toString());

        if (!authConfig) {
          throw new Error('Auth config not found!');
        }

        return {
          secret: authConfig.secretKey,
          signOptions: {
            expiresIn: authConfig.jwtExpirationTime,
            issuer: authConfig.jwtIssuer,
            audience: authConfig.jwtAudience,
          },
          verifyOptions: {
            issuer: authConfig.jwtIssuer,
            audience: authConfig.jwtAudience,
          },
        };
      },
    }),
    AccountModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtSrategy,
    {
      provide: AUTH_CONFIG_TOKEN,
      useFactory: (configService: ConfigService): TAuthConfig => {
        return configService.get<TAuthConfig>(
          AUTH_CONFIG_TOKEN.toString(),
        ) as TAuthConfig;
      },
      inject: [ConfigService],
    },
  ],
})
export class AuthModule {}
