import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferBillingType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @ApiProperty({ example: 'link-premium' })
  @IsString()
  offerSlug: string;

  @ApiProperty({ enum: OfferBillingType, example: OfferBillingType.YEARLY })
  @IsEnum(OfferBillingType)
  billingType: OfferBillingType;

  @ApiPropertyOptional({ description: 'ID équipe (abonnement team)' })
  @IsOptional()
  @IsString()
  teamId?: string;
}
