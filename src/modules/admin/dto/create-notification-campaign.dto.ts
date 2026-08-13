import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationAudience } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
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
}
