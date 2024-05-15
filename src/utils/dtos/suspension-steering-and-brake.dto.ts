import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ABS,
  BrakeType,
  FrameDesign,
  FrontSuspensionSystem,
  RearSuspensionSystem,
  SteeringGearType,
  SteeringType,
} from '../common/variant.enum';

export class SuspensionSteeringAndBrakeDto {
  @IsOptional()
  @IsEnum(SteeringType)
  steeringType: SteeringType;

  @IsOptional()
  @IsEnum(SteeringGearType)
  steeringGearType: SteeringGearType;

  @IsOptional()
  @IsString()
  steeringColumn: string | null;

  @IsOptional()
  @IsNumber()
  minimumTurningRadius: number | null;

  @IsNotEmpty()
  @IsEnum(RearSuspensionSystem)
  rearSuspension: RearSuspensionSystem;

  @IsNotEmpty()
  @IsEnum(FrontSuspensionSystem)
  frontSuspension: FrontSuspensionSystem;

  @IsNotEmpty()
  @IsEnum(BrakeType)
  frontBrakeType: BrakeType;

  @IsNotEmpty()
  @IsEnum(BrakeType)
  rearBrakeType: BrakeType;

  @IsOptional()
  @IsString()
  shockAbsorbersType: string;

  @IsNotEmpty()
  @IsString()
  bodyType: string;

  @IsOptional()
  @IsString()
  platform: string;

  @IsOptional()
  @IsEnum(FrameDesign)
  frame: FrameDesign;

  @IsOptional()
  @IsNumber()
  frontBrakeDiameter: number;

  @IsOptional()
  @IsNumber()
  rearBrakeDiameter: number;

  @IsOptional()
  @IsBoolean()
  radialTyre: boolean | null;

  @IsNotEmpty()
  @IsString()
  tyreSize: string;

  @IsNotEmpty()
  @IsNumber()
  wheelSize: number | null;

  @IsNotEmpty()
  @IsString()
  wheelType: string | null;

  @IsOptional()
  @IsBoolean()
  tubelessTyre: boolean | null;

  @IsOptional()
  @IsEnum(ABS)
  abs: ABS;
}
export class UpdateSuspensionSteeringAndBrakeDto extends SuspensionSteeringAndBrakeDto {
  @IsOptional()
  @IsString()
  id: string;
}
