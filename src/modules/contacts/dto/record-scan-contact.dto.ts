import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RecordScanContactDto {
  @ApiPropertyOptional({ example: 'Marie' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Diallo' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'marie@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+221 77 000 00 00' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Directrice commerciale' })
  @IsOptional()
  @IsString()
  jobTitle?: string;

  @ApiPropertyOptional({ example: 'Mega SN' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'alex-moreau' })
  @IsOptional()
  @IsString()
  cardSlug?: string;
}
