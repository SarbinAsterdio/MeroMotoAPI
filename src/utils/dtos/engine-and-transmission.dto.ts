import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ClutchType,
  CoolingSystem,
  DriveType,
  EngineType,
  FuelSupply,
  GearBox,
  NumberOfCylinders,
  Starting,
  Transmission,
  Trim,
  ValvesPerCylinder,
} from '../common/variant.enum';

export class EngineAndTransmissionDto {
  @IsOptional()
  @IsEnum(EngineType)
  engineType: EngineType;

  @IsNotEmpty()
  @IsEnum(Transmission)
  transmission: Transmission;

  @IsOptional()
  @IsNumber()
  engineDisplacement: number;

  @IsOptional()
  @IsNumber()
  mileage: number;

  @IsOptional()
  @IsEnum(NumberOfCylinders)
  noOfCylinder: NumberOfCylinders;

  @IsOptional()
  @IsEnum(ValvesPerCylinder)
  valvesPerCylinder: ValvesPerCylinder;

  @IsNotEmpty()
  @IsNumber()
  maximumTorque: number;

  @IsNotEmpty()
  @IsNumber()
  maximumPower: number;

  @IsOptional()
  @IsNumber()
  powerRPM: number;

  @IsOptional()
  @IsNumber()
  torqueRPM: number;

  @IsOptional()
  @IsEnum(GearBox)
  gearBox: GearBox;

  @IsNotEmpty()
  @IsEnum(DriveType)
  driveType: DriveType;

  @IsOptional()
  @IsEnum(CoolingSystem)
  coolingSystem: CoolingSystem;

  @IsOptional()
  @IsEnum(Starting)
  starting: Starting;

  @IsOptional()
  @IsEnum(FuelSupply)
  fuelSupply: FuelSupply;

  @IsOptional()
  @IsEnum(ClutchType)
  clutch: ClutchType;

  @IsOptional()
  @IsNumber()
  bore: number | null;

  @IsOptional()
  @IsNumber()
  stroke: number | null;

  @IsOptional()
  @IsString()
  compressionRatio: string | null;

  @IsOptional()
  @IsString()
  emmissionType: string | null;

  @IsOptional()
  @IsNumber()
  batteryCapacity: number | null;

  @IsOptional()
  @IsString()
  motorType: string | null;

  @IsOptional()
  @IsNumber()
  motorPower: number | null;

  @IsOptional()
  @IsNumber()
  range: number | null;

  @IsOptional()
  @IsNumber()
  chargingTimeAC: number | null;

  @IsOptional()
  @IsNumber()
  chargingTimeDC: number | null;

  @IsOptional()
  @IsNumber()
  chargingTime0to80: number | null;

  @IsOptional()
  @IsNumber()
  chargingTime0to100: number | null;

  @IsOptional()
  @IsBoolean()
  fastCharging: boolean | null;

  @IsOptional()
  @IsString()
  chargingPort: string | null;

  @IsOptional()
  @IsEnum(Trim)
  trim: Trim;
}

export class UpdateEngineAndTransmissionDto extends EngineAndTransmissionDto {
  @IsOptional()
  @IsString()
  id: string;
}
