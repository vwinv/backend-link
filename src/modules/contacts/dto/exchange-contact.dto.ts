import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExchangeContactDto {
  @ApiProperty({ example: 'jean-dupont-pro' })
  @IsString()
  @IsNotEmpty()
  cardSlug!: string;
}
