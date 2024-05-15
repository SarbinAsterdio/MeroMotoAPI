/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  CreateAvailableColorDto,
  UpdateAvailableColorDto,
} from '../availableColors/availableColor.dto';
import { Type } from 'class-transformer';

export class CreateModelDto {
  @IsNotEmpty()
  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsBoolean()
  isElectric: boolean;

  @IsNotEmpty({ message: 'At least one available color is required' })
  @Type(() => CreateAvailableColorDto)
  @ValidateNested({ each: true })
  availableColors: Array<CreateAvailableColorDto>;

  @IsString()
  brand: string | any;
  @IsString()
  category: string | any;
  @IsString()
  bodyType: string | any;
}

export class UpdateModelDto extends CreateModelDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'At least one available color is required' })
  @Type(() => UpdateAvailableColorDto)
  @ValidateNested({ each: true })
  availableColors: Array<UpdateAvailableColorDto>;
}
