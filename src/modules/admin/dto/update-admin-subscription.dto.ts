import { ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateAdminSubscriptionDto {
  @ApiPropertyOptional({ description: 'ID de l’offre' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  offerId?: string;

  @ApiPropertyOptional({ description: 'ID du tarif' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  offerPriceId?: string;

  @ApiPropertyOptional({ enum: SubscriptionStatus })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  status?: SubscriptionStatus;

  @ApiPropertyOptional({ description: 'ID d’équipe (offres pro)' })
  @IsOptional()
  @IsString()
  teamId?: string;

  @ApiPropertyOptional({ description: 'Nombre de sièges (offres pro)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  purchasedSeats?: number;

  @ApiPropertyOptional({
    description: 'Fin de période (ISO).',
  })
  @IsOptional()
  @IsDateString()
  currentPeriodEnd?: string;
}
