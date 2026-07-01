import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeamMemberRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ example: 'membre@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ enum: TeamMemberRole, default: TeamMemberRole.MEMBER })
  @IsOptional()
  @IsEnum(TeamMemberRole)
  role?: TeamMemberRole;
}
