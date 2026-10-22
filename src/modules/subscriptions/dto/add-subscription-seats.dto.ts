import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class AddSubscriptionSeatsDto {
  @ApiProperty({ description: 'Équipe dont on augmente les places' })
  @IsString()
  @MinLength(1)
  teamId!: string;

  @ApiProperty({ example: 1, description: 'Places payantes à ajouter' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  additionalSeats!: number;
}
