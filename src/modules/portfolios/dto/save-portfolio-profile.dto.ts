import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class PortfolioExperienceDto {
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  role: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  company?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(80)
  period?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(240)
  missions?: string;
}

export class PortfolioTeachingDto {
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(160)
  school?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  year?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  audience?: string;
}

export class PortfolioSkillDto {
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  id: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(100)
  level: number;
}

export class PortfolioProfileProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  projectUrl?: string;
}

export class SavePortfolioProfileDto {
  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  photoUrl?: string | null;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string | null;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(180)
  address?: string | null;

  @ApiProperty()
  @IsBoolean()
  hidePersonalDetails: boolean;

  @ApiProperty()
  @IsString()
  @MaxLength(160)
  title: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(800)
  description?: string | null;

  @ApiProperty({ type: [PortfolioExperienceDto] })
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PortfolioExperienceDto)
  experiences: PortfolioExperienceDto[];

  @ApiProperty({ type: [PortfolioTeachingDto] })
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PortfolioTeachingDto)
  teachings: PortfolioTeachingDto[];

  @ApiProperty({ type: [PortfolioSkillDto] })
  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => PortfolioSkillDto)
  skills: PortfolioSkillDto[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(24)
  @IsString({ each: true })
  competences: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(24)
  @IsString({ each: true })
  strengths: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMaxSize(24)
  @IsString({ each: true })
  interests: string[];

  @ApiProperty({ type: [PortfolioProfileProjectDto] })
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => PortfolioProfileProjectDto)
  projects: PortfolioProfileProjectDto[];
}
