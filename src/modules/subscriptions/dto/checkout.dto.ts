import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfferBillingType } from '@prisma/client';

export class CheckoutDto {
  @ApiProperty({ example: 'link-premium' })
  @IsString()
  offerSlug!: string;

  @ApiProperty({ enum: OfferBillingType, example: OfferBillingType.MONTHLY })
  @IsEnum(OfferBillingType)
  billingType!: OfferBillingType;

  @ApiPropertyOptional({ description: 'Requis pour les offres équipe' })
  @IsOptional()
  @IsString()
  teamId?: string;
}
