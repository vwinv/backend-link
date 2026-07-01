import { ApiProperty } from '@nestjs/swagger';
import { TeamMemberRole } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: TeamMemberRole })
  @IsEnum(TeamMemberRole)
  role: TeamMemberRole;
}
