/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { VehicleCondition } from '../utils/common/common.enum';

export class CreateVehicleRequirementDto {
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

  @IsOptional()
  user: string | any;

  @IsNotEmpty()
  @IsNumber()
  minBudget: number;

  @IsNotEmpty()
  @IsNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  maxBudget: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  transmission: string;
}
export class UpdateVehicleRequirementDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  remarks: string;
}
