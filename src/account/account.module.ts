import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AccountService } from '@src/account/service/account.service';
import { Account } from '@src/account/entity/account.entity';
import { Email } from '@src/account/entity/email.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [Account, Email] })],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
