import { EntityRepository } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Account } from '@src/account/entity/account.entity';

@Injectable()
export class AccountRepository extends EntityRepository<Account> {
  public async insert(account: Account): Promise<Account> {
    const persistentAccount = this.create(account);

    await this._em.persistAndFlush(persistentAccount);
    return persistentAccount;
  }
}
