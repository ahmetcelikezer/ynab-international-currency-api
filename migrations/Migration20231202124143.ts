import { Migration } from '@mikro-orm/migrations';

export class Migration20231202124143 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "emails" ("id" uuid not null, "address" varchar(320) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "banned_at" timestamptz(0) null default null, constraint "emails_pkey" primary key ("id"));');
    this.addSql('create index "emails_address_index" on "emails" ("address");');
    this.addSql('alter table "emails" add constraint "emails_address_unique" unique ("address");');

    this.addSql('create table "accounts" ("id" uuid not null, "email_id" uuid not null, "hashed_password" varchar(255) not null, constraint "accounts_pkey" primary key ("id"));');
    this.addSql('create index "accounts_email_id_index" on "accounts" ("email_id");');
    this.addSql('alter table "accounts" add constraint "accounts_email_id_unique" unique ("email_id");');

    this.addSql('alter table "accounts" add constraint "accounts_email_id_foreign" foreign key ("email_id") references "emails" ("id") on update cascade;');
  }

}
