import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContactsModule } from '../contacts/contacts.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ScansController } from './scans.controller';
import { ScansService } from './scans.service';

@Module({
  imports: [AuthModule, SubscriptionsModule, ContactsModule],
  controllers: [ScansController],
  providers: [ScansService],
  exports: [ScansService],
})
export class ScansModule {}
