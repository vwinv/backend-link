import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsController } from './subscriptions.controller';
import { EntitlementsService } from './entitlements.service';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [AuthModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, EntitlementsService],
  exports: [SubscriptionsService, EntitlementsService],
})
export class SubscriptionsModule {}
