import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { NavItemChildType } from '../common/common.enum';

export class CreateChildNavItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsEnum(NavItemChildType)
  type: NavItemChildType;

  @IsOptional()
  @IsString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navbar: string | any;
}

export class UpdateChildNavItemDto extends CreateChildNavItemDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class UpdateFeaturedAndPositionNavChild {
  @IsNotEmpty()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsNumber()
  position: number;
}
