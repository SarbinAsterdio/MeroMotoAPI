/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsString,
  IsArray,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import {
  VehicleCondition,
  UsedVehicleCondition,
  VehicleOwner,
} from '../utils/common/common.enum';

export class CreateVehicleDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  images: Array<string>;

  @IsOptional()
  @IsArray()
  exteriorImages: Array<string>;

  @IsOptional()
  @IsArray()
  interiorImages: Array<string>;

  @IsNotEmpty()
  @IsEnum(VehicleCondition)
  condition: VehicleCondition;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsNumber()
  year: number;

  @IsOptional()
  @IsString()
  chargingTime: string;

  @IsOptional()
  @IsString()
  view360: string;

  @IsOptional()
  @IsString()
  video: string;

  @IsOptional()
  @IsString()
  location: string;

  @IsOptional()
  @IsNumber()
  registerYear: number;

  @IsOptional()
  @IsNumber()
  motorPower: number;

  @IsOptional()
  @IsString()
  motor: string;

  @IsOptional()
  @IsString()
  acceleration: string;

  @IsOptional()
  @IsArray()
  features: Array<string>;

  @IsOptional()
  @IsArray()
  blueBookImages: Array<string>;

  @IsOptional()
  @IsArray()
  roadTaxImages: Array<string>;

  @IsOptional()
  @IsArray()
  insuranceImages: Array<string>;

  @IsOptional()
  @IsNumber()
  position: number;

  //for used vehicle only
  @IsOptional()
  @IsString()
  variant: string | any;

  @IsString()
  brand: string | any;

  @IsString()
  model: string | any;

  @IsString()
  category: string | any;

  @IsOptional()
  @IsNumber()
  usedVehicleTotalMileage: number;

  @IsOptional()
  @IsBoolean()
  certified: boolean | null;

  @IsOptional()
  @IsBoolean()
  approved: boolean | null;

  @IsOptional()
  @IsBoolean()
  upcoming: boolean | null;

  @IsOptional()
  expectedLaunchDate: Date;

  @IsOptional()
  @IsEnum(UsedVehicleCondition)
  vehicleCondition: UsedVehicleCondition;

  @IsOptional()
  @IsEnum(VehicleOwner)
  vehicleOwner: VehicleOwner;

  @IsOptional()
  @IsString()
  availableColor: string | any;
}

export class UpdateVehicleDto extends CreateVehicleDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  availableColor: string | any;
}
