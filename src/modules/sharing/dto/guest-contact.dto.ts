import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GuestContactDto {
  @ApiPropertyOptional({
    description: 'Id de la vue carte créée à l’ouverture du lien',
  })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  viewId?: string;

  @ApiProperty({ example: 'Aminata', description: 'Prénom, ou nom complet si lastName est vide' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  firstName: string;

  @ApiPropertyOptional({ example: 'Sow' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiProperty({ example: 'aminata.sow@mega-sn.com' })
  @IsEmail()
  @MaxLength(180)
  email: string;

  @ApiPropertyOptional({ example: '784504052' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;
}
