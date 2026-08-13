import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferBillingType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

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

  @ApiPropertyOptional({
    description: 'Nombre d’utilisateurs (offres pro tarifées au siège)',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seats?: number;
}
