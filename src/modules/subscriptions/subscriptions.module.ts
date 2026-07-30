import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PaydunyaModule } from '../paydunya/paydunya.module';
import { PaydunyaWebhookController } from '../paydunya/paydunya-webhook.controller';
import { EntitlementsService } from './entitlements.service';
import { StripeService } from './stripe.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [AuthModule, PaydunyaModule],
  controllers: [SubscriptionsController, PaydunyaWebhookController],
  providers: [SubscriptionsService, EntitlementsService, StripeService],
  exports: [SubscriptionsService, EntitlementsService, StripeService],
})
export class SubscriptionsModule {}
