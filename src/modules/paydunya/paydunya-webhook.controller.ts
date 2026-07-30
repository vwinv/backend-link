import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

/**
 * Endpoint public (sans JWT) pour l’IPN PayDunya.
 * URL : {PUBLIC_API_URL}/{API_PREFIX}/webhooks/paydunya
 */
@ApiTags('Webhooks')
@Controller('webhooks/paydunya')
export class PaydunyaWebhookController {
  private readonly logger = new Logger(PaydunyaWebhookController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @ApiOperation({ summary: 'IPN PayDunya (callback paiement SoftPay)' })
  handle(@Body() body: Record<string, unknown>) {
    this.logger.log(
      `IPN PayDunya brut: ${JSON.stringify(body ?? {}).slice(0, 600)}`,
    );
    return this.subscriptionsService.handlePaydunyaIpn(body ?? {});
  }
}
