import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FuelType } from '../common/variant.enum';

export class FuelAndPerformanceDto {
  @IsNotEmpty()
  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsOptional()
  @IsNumber()
  cngMileage: number;

  @IsOptional()
  @IsNumber()
  cngHighwayMileage: number | null;

  @IsOptional()
  @IsString()
  emissionNormCompliance: string | null;

  @IsOptional()
  @IsNumber()
  topSpeed: number | null;

  @IsOptional()
  @IsNumber()
  acceleration: number | null;
}

export class UpdateFuelAndPerformanceDto extends FuelAndPerformanceDto {
  @IsOptional()
  @IsString()
  id: string;
}
