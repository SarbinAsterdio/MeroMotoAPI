import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AdColumnType, PageName } from '../common/common.enum';

export class CreateAdDto {
  @IsNotEmpty()
  @IsString()
  webImage: string;

  @IsNotEmpty()
  @IsString()
  mobileImage: string;

  @IsNotEmpty()
  @IsBoolean()
  default: boolean;

  @IsNotEmpty()
  @IsString()
  link: string;

  @IsNotEmpty()
  @IsEnum(PageName)
  pageName: PageName;

  @IsNotEmpty()
  @IsEnum(AdColumnType)
  column: AdColumnType;

  @IsOptional()
  // @IsDate()
  startDateAndTime: Date;

  @IsOptional()
  // @IsDate()
  endDateAndTime: Date;
}

export class UpdateAdDto extends CreateAdDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class UpdateStatusAndPosition {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  position: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
