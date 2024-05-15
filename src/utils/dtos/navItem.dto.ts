import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { NavItemType } from '../common/common.enum';
import { Type } from 'class-transformer';
import {
  CreateChildNavItemDto,
  UpdateChildNavItemDto,
} from './navItem-child.dto';

export class CreateNavItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  link: string;

  @IsOptional()
  @IsEnum(NavItemType)
  type: NavItemType;

  @Type(() => CreateChildNavItemDto)
  @ValidateNested()
  subMenu: Array<CreateChildNavItemDto>;
}

export class UpdateNavItemDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  link: string;

  @IsOptional()
  @IsEnum(NavItemType)
  type: NavItemType;

  @Type(() => UpdateChildNavItemDto)
  @ValidateNested()
  subMenu: Array<UpdateChildNavItemDto>;

  @IsOptional()
  @IsString()
  id: string;
}

export class UpdatePositionAndFeatured {
  @IsNotEmpty()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsNumber()
  position: number;
}
