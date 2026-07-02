import { ApiProperty } from '@nestjs/swagger';
import { TeamSeatsQuotaDto } from '../../subscriptions/dto/usage-quota.dto';

export class TeamMembersResponseDto {
  @ApiProperty({ type: [Object] })
  members: unknown[];

  @ApiProperty({ type: [Object] })
  pendingInvites: unknown[];

  @ApiProperty({ type: TeamSeatsQuotaDto })
  seats: TeamSeatsQuotaDto;
}
