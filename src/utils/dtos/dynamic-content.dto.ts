import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PageName, DynamicContentType } from '../common/common.enum';

export class CreateDescriptionDto {
  @IsNotEmpty()
  @IsEnum(PageName)
  pageName: PageName;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(DynamicContentType)
  type: DynamicContentType;
}

export class UpdateDescriptionDto extends CreateDescriptionDto {
  @IsOptional()
  @IsString()
  id: string;
}
