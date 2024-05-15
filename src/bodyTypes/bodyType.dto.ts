import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CategoryCHeck {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsString()
  slug: string;
}

export class CreateBodyTypeDto {
  @IsNotEmpty()
  @IsString()
  bodyType: string;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  categories: Array<string> | any;
}

export class UpdateBodyTypeDto extends CreateBodyTypeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
