import { TeamSeatsQuotaDto } from '../../subscriptions/dto/usage-quota.dto';
export declare class TeamMembersResponseDto {
    members: unknown[];
    pendingInvites: unknown[];
    seats: TeamSeatsQuotaDto;
}
