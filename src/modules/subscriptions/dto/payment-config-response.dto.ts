import { ApiProperty } from '@nestjs/swagger';

export class PaymentConfigResponseDto {
  @ApiProperty({
    description:
      'Si true, la souscription passe par PayDunya SoftPay. Sinon, activation immédiate (tests).',
  })
  paymentsEnabled!: boolean;

  @ApiProperty({ example: 'paydunya', required: false })
  provider?: string;
}

export class CheckoutSessionResponseDto {
  @ApiProperty()
  checkoutUrl!: string;

  @ApiProperty({ description: 'Token facture PayDunya (SoftPay)' })
  invoiceToken!: string;

  @ApiProperty({ description: 'Alias de invoiceToken (compat)' })
  sessionId!: string;

  @ApiProperty({ required: false })
  amountFcfa?: number;

  @ApiProperty({ required: false })
  description?: string;
}
