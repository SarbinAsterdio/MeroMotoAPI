import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AirBags, BrakeType } from '../common/variant.enum';

export class SafetyAndFeaturesDto {
  @IsOptional()
  @IsBoolean()
  childSafetyLocks: boolean | null;

  @IsOptional()
  @IsEnum(BrakeType)
  brakingType: BrakeType;

  @IsOptional()
  @IsString()
  chargingPoint: string | null;

  @IsOptional()
  @IsBoolean()
  artificialExhaustSoundSystem: boolean | null;

  @IsOptional()
  @IsBoolean()
  bodyGraphics: boolean | null;

  @IsOptional()
  @IsBoolean()
  tyrePressureMonitor: boolean | null;

  @IsOptional()
  @IsBoolean()
  speedAlert: boolean | null;

  @IsOptional()
  @IsBoolean()
  impactSensingAutoDoorUnlock: boolean | null;

  @IsOptional()
  @IsBoolean()
  antiLockBrakingSystem: boolean;

  @IsOptional()
  @IsBoolean()
  centralLocking: boolean | null;

  @IsOptional()
  @IsBoolean()
  powerDoorLocks: boolean | null;

  @IsOptional()
  @IsEnum(AirBags)
  noOfAirbags: AirBags;

  @IsOptional()
  @IsBoolean()
  driverAirbag: boolean | null;

  @IsOptional()
  @IsBoolean()
  passengerAirbag: boolean | null;

  @IsOptional()
  @IsBoolean()
  dayAndNightRearViewMirror: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearSeatBelts: boolean | null;

  @IsOptional()
  @IsBoolean()
  passengerSideRearViewMirror: boolean | null;

  @IsOptional()
  @IsBoolean()
  seatBeltWarning: boolean | null;

  @IsOptional()
  @IsString()
  seatType: string | null;

  @IsOptional()
  @IsBoolean()
  doorAjarWarning: boolean | null;

  @IsOptional()
  @IsBoolean()
  adjustableSeats: boolean | null;

  @IsOptional()
  @IsBoolean()
  engineImmobilizer: boolean | null;

  @IsOptional()
  @IsBoolean()
  crashSensor: boolean | null;

  @IsOptional()
  @IsBoolean()
  engineCheckWarning: boolean | null;

  @IsOptional()
  @IsBoolean()
  automaticHeadlamps: boolean | null;

  @IsOptional()
  @IsBoolean()
  EBD: boolean | null;

  @IsOptional()
  @IsBoolean()
  advanceSafetyFeatures: boolean | null;

  @IsOptional()
  @IsBoolean()
  followMeHomeHeadlamps: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearCamera: boolean | null;

  @IsOptional()
  @IsBoolean()
  speedSensingAutoDoorLock: boolean | null;

  @IsOptional()
  @IsBoolean()
  pretensionersAndForceLimiterSeatbelts: boolean | null;
}
export class UpdateSafetyAndFeaturesDto extends SafetyAndFeaturesDto {
  @IsOptional()
  @IsString()
  id: string;
}
