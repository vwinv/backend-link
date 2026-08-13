import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class AddSeatsDto {
  @ApiProperty({
    description: 'Nombre de sièges à ajouter (paiement immédiat)',
    example: 3,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  additionalSeats!: number;
}
