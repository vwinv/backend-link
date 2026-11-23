import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationAudience,
  NotificationRecurrence,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateNotificationCampaignDto {
  @ApiProperty({ example: 'Nouvelle fonctionnalité' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 'Découvrez le nouveau design de cartes.' })
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  body!: string;

  @ApiPropertyOptional({
    example: 'New Premium offer',
    description: 'Titre anglais (utilisé si la langue app est en)',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  titleEn?: string;

  @ApiPropertyOptional({
    example: 'Discover the new card design.',
    description: 'Message anglais (utilisé si la langue app est en)',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  bodyEn?: string;

  @ApiProperty({ enum: NotificationAudience })
  @IsEnum(NotificationAudience)
  audience!: NotificationAudience;

  @ApiPropertyOptional({
    description: 'IDs clients ciblés (requis si audience = USER_IDS)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(500)
  @IsString({ each: true })
  userIds?: string[];

  @ApiPropertyOptional({
    description:
      'Date/heure d’envoi ISO (UTC). Absent = envoi immédiat. Ex. 2026-11-25T14:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({
    enum: NotificationRecurrence,
    default: NotificationRecurrence.ONCE,
  })
  @IsOptional()
  @IsEnum(NotificationRecurrence)
  recurrence?: NotificationRecurrence;

  @ApiPropertyOptional({
    description: 'Fin des envois récurrents (ISO UTC)',
  })
  @ValidateIf((o: CreateNotificationCampaignDto) => !!o.scheduledAt)
  @IsOptional()
  @IsDateString()
  recurrenceEndsAt?: string;

  @ApiPropertyOptional({
    description: 'Nombre max d’envois (1–365). Null = illimité jusqu’à la date de fin.',
  })
  @ValidateIf((o: CreateNotificationCampaignDto) => !!o.scheduledAt)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  maxOccurrences?: number;
}
