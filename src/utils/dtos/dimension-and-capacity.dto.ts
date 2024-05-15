import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Doors, SeatingCapacity } from '../common/variant.enum';

export class DimensionAndCapacityDto {
  @IsNotEmpty()
  @IsNumber()
  length: number;

  @IsNotEmpty()
  @IsNumber()
  width: number;

  @IsNotEmpty()
  @IsNumber()
  height: number;

  @IsOptional()
  @IsNumber()
  bootSpace: number;

  @IsOptional()
  @IsEnum(SeatingCapacity)
  seatingCapacity: SeatingCapacity;

  @IsNotEmpty()
  @IsNumber()
  groundClearance: number;

  @IsOptional()
  @IsEnum(Doors)
  noOfDoors: Doors;

  @IsOptional()
  @IsNumber()
  fuelCapacity: number | null;

  @IsOptional()
  @IsNumber()
  saddleHeight: number;

  @IsNotEmpty()
  @IsNumber()
  wheelbase: number;

  @IsNotEmpty()
  @IsNumber()
  kerbWeight: number;

  @IsNotEmpty()
  @IsNumber()
  loadCarryingCapacity: number;
}

export class UpdateDimensionAndCapacityDto extends DimensionAndCapacityDto {
  @IsOptional()
  @IsString()
  id: string;
}
