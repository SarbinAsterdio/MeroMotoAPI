/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EngineAndTransmissionDto,
  UpdateEngineAndTransmissionDto,
} from '../utils/dtos/engine-and-transmission.dto';
import {
  FuelAndPerformanceDto,
  UpdateFuelAndPerformanceDto,
} from '../utils/dtos/fuel-and-performance.dto';
import {
  SuspensionSteeringAndBrakeDto,
  UpdateSuspensionSteeringAndBrakeDto,
} from '../utils/dtos/suspension-steering-and-brake.dto';
import {
  DimensionAndCapacityDto,
  UpdateDimensionAndCapacityDto,
} from '../utils/dtos/dimension-and-capacity.dto';
import {
  MotorAndBatteryDto,
  UpdateMotorAndBatteryDto,
} from '../utils/dtos/motor-and-battery.dto';
import {
  ComfortAndConvenienceDto,
  UpdateComfortAndConvenienceDto,
} from '../utils/dtos/comfort-and-convenience.dto';
import { InteriorDto, UpdateInteriorDto } from '../utils/dtos/interior.dto';
import { ExteriorDto, UpdateExteriorDto } from '../utils/dtos/exterior.dto';
import {
  SafetyAndFeaturesDto,
  UpdateSafetyAndFeaturesDto,
} from '../utils/dtos/safety-and-features.dto';
import {
  EntertainmentAndCommunicationDto,
  UpdateEntertainmentAndCommunicationDto,
} from '../utils/dtos/entertainment-and-communication.dto';

export class CreateVariantDto {
  @IsNotEmpty()
  @IsString()
  variant: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0, { message: 'Price must be a positive number' }) // Define your range as needed
  @Max(1000000000, { message: 'Price must be less than or equal to 1,000,000' })
  price: number;

  @IsOptional()
  @IsBoolean()
  featured: boolean;

  @IsOptional()
  @IsBoolean()
  baseVariant: boolean;

  @IsString()
  model: string | any;

  @IsString()
  category: string | any;

  @Type(() => EngineAndTransmissionDto)
  @ValidateNested()
  engineAndTransmission: EngineAndTransmissionDto;

  @Type(() => FuelAndPerformanceDto)
  @ValidateNested()
  fuelAndPerformance: FuelAndPerformanceDto;

  @Type(() => SuspensionSteeringAndBrakeDto)
  @ValidateNested()
  suspensionSteeringAndBrake: SuspensionSteeringAndBrakeDto;

  @Type(() => DimensionAndCapacityDto)
  @ValidateNested()
  dimensionAndCapacity: DimensionAndCapacityDto;

  @Type(() => MotorAndBatteryDto)
  @ValidateNested()
  motorAndBattery: MotorAndBatteryDto;

  @Type(() => ComfortAndConvenienceDto)
  @ValidateNested()
  comfortAndConvenience: ComfortAndConvenienceDto;

  @Type(() => InteriorDto)
  @ValidateNested()
  interior: InteriorDto;

  @Type(() => ExteriorDto)
  @ValidateNested()
  exterior: ExteriorDto;

  @Type(() => SafetyAndFeaturesDto)
  @ValidateNested()
  safetyAndFeatures: SafetyAndFeaturesDto;

  @Type(() => EntertainmentAndCommunicationDto)
  @ValidateNested()
  entertainmentAndCommunication: EntertainmentAndCommunicationDto;
}

export class UpdateVariantDto extends CreateVariantDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @Type(() => UpdateEngineAndTransmissionDto)
  @ValidateNested()
  engineAndTransmission: UpdateEngineAndTransmissionDto;

  @Type(() => UpdateFuelAndPerformanceDto)
  @ValidateNested()
  fuelAndPerformance: UpdateFuelAndPerformanceDto;

  @Type(() => UpdateSuspensionSteeringAndBrakeDto)
  @ValidateNested()
  suspensionSteeringAndBrake: UpdateSuspensionSteeringAndBrakeDto;

  @Type(() => UpdateDimensionAndCapacityDto)
  @ValidateNested()
  dimensionAndCapacity: UpdateDimensionAndCapacityDto;

  @Type(() => UpdateMotorAndBatteryDto)
  @ValidateNested()
  motorAndBattery: UpdateMotorAndBatteryDto;

  @Type(() => UpdateComfortAndConvenienceDto)
  @ValidateNested()
  comfortAndConvenience: UpdateComfortAndConvenienceDto;

  @Type(() => UpdateInteriorDto)
  @ValidateNested()
  interior: UpdateInteriorDto;

  @Type(() => UpdateExteriorDto)
  @ValidateNested()
  exterior: UpdateExteriorDto;

  @Type(() => UpdateSafetyAndFeaturesDto)
  @ValidateNested()
  safety: UpdateSafetyAndFeaturesDto;

  @Type(() => UpdateEntertainmentAndCommunicationDto)
  @ValidateNested()
  entertainmentAndCommunication: UpdateEntertainmentAndCommunicationDto;
}
