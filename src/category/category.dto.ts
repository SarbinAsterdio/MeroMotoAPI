import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CatType } from '../utils/common';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @IsString({ message: 'Category name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Category image is required' })
  @IsString({ message: 'Category image must be a string' })
  image: string;

  @IsNotEmpty({ message: 'Category type is required' })
  @IsEnum(CatType)
  type: CatType;

  @IsNotEmpty({ message: 'Category icon is required' })
  @IsString({ message: 'Category icon must be a string' })
  icon: string;
}

export class UpdateCategoryDto extends CreateCategoryDto {
  @IsOptional()
  @IsString()
  id: string;
}
