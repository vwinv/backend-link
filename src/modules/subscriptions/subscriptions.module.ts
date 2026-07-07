import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionsController } from './subscriptions.controller';
import { EntitlementsService } from './entitlements.service';
import { StripeService } from './stripe.service';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [AuthModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, EntitlementsService, StripeService],
  exports: [SubscriptionsService, EntitlementsService, StripeService],
})
export class SubscriptionsModule {}
