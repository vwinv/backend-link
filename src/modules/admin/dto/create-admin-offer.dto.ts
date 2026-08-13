import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferAudience, OfferBillingType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateAdminOfferPriceDto {
  @ApiProperty({ enum: OfferBillingType })
  @IsEnum(OfferBillingType)
  billingType!: OfferBillingType;

  @ApiProperty({ example: 4000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceAmount!: number;

  @ApiPropertyOptional({
    example: 700,
    description: 'Prix par utilisateur supplémentaire (au-delà des sièges inclus)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerSeat?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  priceLabel?: string | null;

  @ApiPropertyOptional({ example: 'FCFA' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  discountPercent?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  badgeLabel?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  stripePriceId?: string | null;
}

export class CreateAdminOfferDto {
  @ApiProperty({ example: 'DropOne Premium' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 'link-premium' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug: kebab-case uniquement (a-z, 0-9, tirets)',
  })
  slug!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  subtitle?: string | null;

  @ApiProperty({ enum: OfferAudience })
  @IsEnum(OfferAudience)
  audience!: OfferAudience;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  canCustomize?: boolean;

  @ApiPropertyOptional({
    description: '0 = perso, N = plafond, -1 = illimité',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxTeamMembers?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minSeats?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasPortfolio?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasWallet?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasAnalytics?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasVisitorInsights?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  hasSocialLinks?: boolean;

  @ApiPropertyOptional({ description: '-1 = illimité' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxAiScans?: number;

  @ApiPropertyOptional({ description: '-1 = illimité' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  maxShares?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'false = hors catalogue app (offre gratuite)',
  })
  @IsOptional()
  @IsBoolean()
  listedInApp?: boolean;

  @ApiPropertyOptional({ type: [CreateAdminOfferPriceDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateAdminOfferPriceDto)
  prices?: CreateAdminOfferPriceDto[];
}
