import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
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
