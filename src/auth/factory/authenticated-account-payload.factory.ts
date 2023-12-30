import { Account } from '@src/account/entity/account.entity';
import { AuthenticatedAccountPayload } from '@src/auth/payload/authenticated-account.payload';

export class AuthenticatedAccountPayloadFactory {
  public static fromAccount(account: Account): AuthenticatedAccountPayload {
    return new AuthenticatedAccountPayload(account.id, account.email.address);
  }
}
