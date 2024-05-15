/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CompareType } from '../common/common.enum';

export class CreateCompareDto {
  // @IsOptional()
  // @IsString()
  // variant1: string | any;
  // @IsOptional()
  // @IsString()
  // variant2: string | any;
  // @IsOptional()
  // @IsString()
  // variant3: string | any;
  // @IsOptional()
  // @IsString()
  // variant4: string | any;

  @IsNotEmpty()
  @IsArray()
  variants: Array<string> | any;

  @IsNotEmpty()
  @IsEnum(CompareType)
  type: CompareType;
}

export class UpdateCompareDto {
  @IsNotEmpty()
  @IsArray()
  variants: Array<string> | any;

  @IsOptional()
  @IsString()
  id: string;
}
