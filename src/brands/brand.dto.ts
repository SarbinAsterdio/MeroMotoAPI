import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty({ message: 'Brand name is required' })
  @IsString({ message: 'Brand name must be a string' })
  brand: string;

  @IsNotEmpty({ message: 'Brand image is required' })
  @IsString({ message: 'Brand image must be a string' })
  image: string;

  @IsNotEmpty({ message: 'Brand description is required' })
  @IsString({ message: 'Brand description must be a string' })
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'Featured must be either true or false' })
  featured: boolean;

  @IsArray()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: Array<string> | any;
}

export class UpdateBrandDto extends CreateBrandDto {
  @IsOptional()
  @IsString()
  id: string;
}

export class UpdateFeaturedAndPosition {
  @IsNotEmpty()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsNumber()
  position: number;
}
