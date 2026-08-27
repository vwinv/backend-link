import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OfferBillingType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AppleIapVerifyDto {
  @ApiProperty({
    description: 'JWS StoreKit 2 (verificationData.serverVerificationData)',
  })
  @IsString()
  signedTransaction: string;

  @ApiPropertyOptional({ example: 'link-premium' })
  @IsOptional()
  @IsString()
  offerSlug?: string;

  @ApiPropertyOptional({ enum: OfferBillingType })
  @IsOptional()
  @IsEnum(OfferBillingType)
  billingType?: OfferBillingType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  seats?: number;
}
