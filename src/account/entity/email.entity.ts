import {
  DateTimeType,
  Entity,
  Index,
  OneToOne,
  PrimaryKey,
  Property,
  StringType,
  Unique,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Account } from '@src/account/entity/account.entity';

@Entity({ tableName: 'emails' })
export class Email {
  @PrimaryKey({ type: UuidType })
  public readonly id: string;

  @OneToOne(() => Account, (account: Account) => account.email)
  public account: Account;

  @Property({ type: StringType, length: 320 })
  @Unique()
  @Index()
  public address: string;

  @Property({ type: DateTimeType })
  public readonly createdAt: Date = new Date();

  @Property({ type: DateTimeType, onUpdate: () => new Date() })
  public readonly updatedAt: Date = new Date();

  @Property({ type: DateTimeType, nullable: true, default: null })
  public bannedAt: Date | null = null;

  constructor(account: Account, address: string) {
    this.id = v4();
    this.account = account;
    this.address = address;
  }
}
