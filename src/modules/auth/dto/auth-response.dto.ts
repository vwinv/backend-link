import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class AdminRoleSummaryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ nullable: true })
  phone: string | null;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ type: AdminRoleSummaryDto, nullable: true })
  adminRole?: AdminRoleSummaryDto | null;

  @ApiPropertyOptional({ type: [String] })
  permissions?: string[];
}

export class AuthResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;

  @ApiPropertyOptional({
    description: 'true si le compte vient d’être créé',
  })
  isNewUser?: boolean;

  @ApiPropertyOptional({
    description:
      'true si le compte vient d’être créé sans code de parrainage (proposer la saisie)',
  })
  needsReferralPrompt?: boolean;
}
