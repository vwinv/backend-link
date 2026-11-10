import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferBillingType, PointsProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class RedeemPointsDto {
  @ApiProperty({
    enum: PointsProductType,
    example: 'SUBSCRIPTION',
  })
  @IsEnum(PointsProductType)
  productType!: PointsProductType;

  @ApiProperty({
    description: 'Référence produit (slug offre, id thème…)',
    example: 'link-premium',
  })
  @IsString()
  @MinLength(1)
  productRef!: string;

  @ApiPropertyOptional({ enum: OfferBillingType })
  @IsOptional()
  @IsEnum(OfferBillingType)
  billingType?: OfferBillingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seats?: number;
}
