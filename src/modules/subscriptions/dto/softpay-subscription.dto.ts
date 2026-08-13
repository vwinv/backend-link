import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { OfferBillingType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const SUBSCRIPTION_SOFTPAY_METHODS = [
  'wave_sn',
  'orange_money_sn',
  'free_money_sn',
] as const;

export type SubscriptionSoftPayMethod =
  (typeof SUBSCRIPTION_SOFTPAY_METHODS)[number];

export class SoftPaySubscriptionDto {
  @ApiProperty({ example: 'link-premium' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  offerSlug!: string;

  @ApiProperty({ enum: OfferBillingType })
  @IsEnum(OfferBillingType)
  billingType!: OfferBillingType;

  @ApiProperty({ description: 'Token facture PayDunya' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(8)
  invoiceToken!: string;

  @ApiProperty({ enum: SUBSCRIPTION_SOFTPAY_METHODS })
  @IsIn([...SUBSCRIPTION_SOFTPAY_METHODS])
  method!: SubscriptionSoftPayMethod;

  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  prenom!: string;

  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  nom!: string;

  @ApiProperty({ example: '771234567' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(8, { message: 'Numéro de téléphone invalide' })
  telephone!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional({
    description: 'Nombre d’utilisateurs (affichage SoftPay)',
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seats?: number;
}
