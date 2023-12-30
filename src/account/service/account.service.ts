import { Injectable } from '@nestjs/common';
import { AccountRepository } from '@src/account/repository/account.repository';
import { Account } from '@src/account/entity/account.entity';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  public async getAccountByEmailAddress(
    address: string,
  ): Promise<Account | null> {
    return this.accountRepository.findOne({ email: { address } });
  }

  public async createAccount(
    emailAddress: string,
    password: string,
  ): Promise<Account> {
    const account = new Account(emailAddress, password);
    return this.accountRepository.insert(account);
  }
}
