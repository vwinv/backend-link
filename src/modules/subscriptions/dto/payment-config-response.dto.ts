import { ApiProperty } from '@nestjs/swagger';

export class PaymentConfigResponseDto {
  @ApiProperty({
    description:
      'Si true, la souscription passe par Stripe Checkout. Sinon, activation immédiate (tests).',
  })
  paymentsEnabled!: boolean;
}

export class CheckoutSessionResponseDto {
  @ApiProperty()
  checkoutUrl!: string;

  @ApiProperty()
  sessionId!: string;
}
