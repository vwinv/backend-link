import { ApiProperty } from '@nestjs/swagger';

export class TeamSeatsQuotaDto {
  @ApiProperty({ example: 4 })
  used: number;

  @ApiProperty({ example: 5 })
  max: number;

  @ApiProperty({ example: true })
  canAddMember: boolean;
}

export class AiScanQuotaDto {
  @ApiProperty({ example: 12 })
  used: number;

  @ApiProperty({
    example: 50,
    description: 'Quota max (-1 = illimité, 0 = aucun)',
  })
  max: number;

  @ApiProperty({ example: true })
  canScan: boolean;

  @ApiProperty({ example: false })
  isUnlimited: boolean;
}
