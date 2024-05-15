/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { VehicleCondition } from '../common/common.enum';

export class CreateVehicleDetailDto {
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  brand: string | any;

  @IsNotEmpty()
  @IsString()
  model: string | any;

  @IsNotEmpty()
  @IsString()
  category: string | any;

  @IsNotEmpty()
  @IsString()
  user: string | any;

  @IsNotEmpty()
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  transmission: string;

  @IsOptional()
  @IsArray()
  images: Array<string>;
}
export class UpdateVehicleDetailDto extends CreateVehicleDetailDto {
  @IsOptional()
  @IsString()
  id: string;
}
