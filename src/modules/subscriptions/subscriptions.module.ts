import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from '../auth/auth.module';
import { PaydunyaModule } from '../paydunya/paydunya.module';
import { PaydunyaWebhookController } from '../paydunya/paydunya-webhook.controller';
import { EntitlementsService } from './entitlements.service';
import { InvoicesService } from './invoices.service';
import { StripeService } from './stripe.service';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [AuthModule, PaydunyaModule, ScheduleModule.forRoot()],
  controllers: [SubscriptionsController, PaydunyaWebhookController],
  providers: [
    SubscriptionsService,
    EntitlementsService,
    StripeService,
    InvoicesService,
  ],
  exports: [
    SubscriptionsService,
    EntitlementsService,
    StripeService,
    InvoicesService,
  ],
})
export class SubscriptionsModule {}
