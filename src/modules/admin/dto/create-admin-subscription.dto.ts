import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAdminSubscriptionDto {
  @ApiProperty({ description: 'ID du client (utilisateur app)' })
  @IsString()
  @MinLength(1)
  userId!: string;

  @ApiProperty({ description: 'ID de l’offre' })
  @IsString()
  @MinLength(1)
  offerId!: string;

  @ApiProperty({ description: 'ID du tarif' })
  @IsString()
  @MinLength(1)
  offerPriceId!: string;

  @ApiPropertyOptional({
    enum: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL],
    default: SubscriptionStatus.ACTIVE,
  })
  @IsOptional()
  @IsIn([SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL])
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
    description: 'Fin de période (ISO). Calculée automatiquement si absente.',
  })
  @IsOptional()
  @IsDateString()
  currentPeriodEnd?: string;
}
