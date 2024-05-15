import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PageName } from '../common/common.enum';

export class CreateBannerDto {
  @IsOptional()
  @IsString()
  tabImage: string;

  @IsOptional()
  @IsString()
  mobileImage: string;

  @IsOptional()
  @IsBoolean()
  customizable: boolean;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  link: string;

  @IsOptional()
  @IsString()
  buttonText: string;

  @IsNotEmpty()
  @IsString()
  section: string;

  @IsOptional()
  @IsString()
  hexCode: string;

  @IsNotEmpty()
  @IsEnum(PageName)
  pageName: PageName;
}

export class UpdateBannerDto extends CreateBannerDto {
  @IsOptional()
  @IsString()
  id: string;
}
