import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePortfolioDto {
  @ApiProperty({ description: 'ID de la carte de visite liée' })
  @IsString()
  cardId: string;

  @ApiProperty({ example: 'Mon Portfolio' })
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}
