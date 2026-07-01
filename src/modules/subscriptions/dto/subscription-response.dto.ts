import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingPeriod, OfferBillingType, SubscriptionStatus } from '@prisma/client';
import { OfferEntitlementsDto } from './offer-entitlements.dto';

export class SubscriptionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: SubscriptionStatus })
  status: SubscriptionStatus;

  @ApiProperty({ enum: BillingPeriod })
  billingPeriod: BillingPeriod;

  @ApiProperty()
  planName: string;

  @ApiProperty()
  planSlug: string;

  @ApiProperty()
  offerTitle: string;

  @ApiProperty()
  offerSlug: string;

  @ApiPropertyOptional({ enum: OfferBillingType })
  billingType?: OfferBillingType | null;

  @ApiProperty({ type: OfferEntitlementsDto })
  entitlements: OfferEntitlementsDto;

  @ApiPropertyOptional()
  currentPeriodEnd?: string | null;
}
