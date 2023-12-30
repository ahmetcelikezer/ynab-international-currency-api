import {
  DateTimeType,
  Entity,
  EntityRepositoryType,
  Index,
  OneToOne,
  PrimaryKey,
  Property,
  StringType,
  UuidType,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Email } from '@src/account/entity/email.entity';
import { AccountRepository } from '@src/account/repository/account.repository';

@Entity({ tableName: 'accounts', customRepository: () => AccountRepository })
export class Account {
  @PrimaryKey({ type: UuidType })
  public readonly id: string;

  @Index()
  @OneToOne(() => Email, (email: Email) => email.account, {
    owner: true,
    orphanRemoval: true,
    unique: true,
    eager: true,
  })
  public email: Email;

  @Property({ type: StringType })
  public hashedPassword: string;

  @Property({ type: DateTimeType })
  public lastPasswordChangedAt: Date = new Date();

  [EntityRepositoryType]?: AccountRepository;
  constructor(emailAddress: string, hashedPassword: string) {
    this.id = v4();
    this.email = new Email(this, emailAddress);
    this.hashedPassword = hashedPassword;
  }
}
