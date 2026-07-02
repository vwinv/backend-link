import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TeamMemberRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddMemberDto {
  @ApiProperty({ example: 'membre@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'Nina' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;

  @ApiPropertyOptional({ example: 'Ba' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;

  @ApiPropertyOptional({ example: 'Commerciale' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  jobTitle?: string;

  @ApiPropertyOptional({ example: '/uploads/avatar.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  avatarUrl?: string;

  @ApiPropertyOptional({ enum: TeamMemberRole, default: TeamMemberRole.MEMBER })
  @IsOptional()
  @IsEnum(TeamMemberRole)
  role?: TeamMemberRole;
}
