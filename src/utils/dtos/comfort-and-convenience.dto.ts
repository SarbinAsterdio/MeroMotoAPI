import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ComfortAndConvenienceDto {
  @IsOptional()
  @IsBoolean()
  powerSteering: boolean | null;

  @IsOptional()
  @IsBoolean()
  powerWindowsFront: boolean | null;

  @IsOptional()
  @IsBoolean()
  powerWindowsRear: boolean | null;

  @IsOptional()
  @IsBoolean()
  powerBoot: boolean | null;

  @IsOptional()
  @IsBoolean()
  airConditioner: boolean | null;

  @IsOptional()
  @IsBoolean()
  heater: boolean | null;

  @IsOptional()
  @IsBoolean()
  adjustableSteering: boolean | null;

  @IsOptional()
  @IsBoolean()
  automaticClimateControl: boolean | null;

  @IsOptional()
  @IsBoolean()
  lowFuelWarningLight: boolean | null;

  @IsOptional()
  @IsBoolean()
  accessoryPowerOutlet: boolean | null;

  @IsOptional()
  @IsBoolean()
  vanityMirror: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearSeatHeadrest: boolean | null;

  @IsOptional()
  @IsBoolean()
  adjustableHeadrest: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearSeatCentreArmRest: boolean | null;

  @IsOptional()
  @IsBoolean()
  cupHoldersRear: boolean | null;

  @IsOptional()
  @IsBoolean()
  parkingSensors: boolean | null;

  @IsOptional()
  @IsBoolean()
  cruiseControl: boolean | null;

  @IsOptional()
  @IsBoolean()
  findMyCarLocation: boolean | null;

  @IsOptional()
  @IsBoolean()
  smartAccessCardEntry: boolean | null;

  @IsOptional()
  @IsBoolean()
  keyLessEntry: boolean | null;

  @IsOptional()
  @IsBoolean()
  engineStartOrStopButton: boolean | null;

  @IsOptional()
  @IsBoolean()
  handsFreeTailgate: boolean | null;

  @IsOptional()
  @IsArray()
  driveModes: Array<string> | null;

  @IsOptional()
  @IsBoolean()
  gloveBoxCooling: boolean | null;

  @IsOptional()
  @IsBoolean()
  voiceControl: boolean | null;

  @IsOptional()
  @IsBoolean()
  gearShiftIndicator: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearCurtain: boolean | null;

  @IsOptional()
  @IsBoolean()
  luggageHookAndNet: boolean | null;

  @IsOptional()
  @IsBoolean()
  mobileApplication: boolean | null;

  @IsOptional()
  @IsBoolean()
  speedometer: boolean | null;

  @IsOptional()
  @IsBoolean()
  tachometer: boolean | null;

  @IsOptional()
  @IsBoolean()
  tripmeter: boolean | null;

  @IsOptional()
  @IsBoolean()
  fuelGauge: boolean | null;

  @IsOptional()
  @IsBoolean()
  clock: boolean | null;

  @IsOptional()
  @IsBoolean()
  passengerFootrest: boolean | null;

  @IsOptional()
  @IsBoolean()
  engineKillSwitch: boolean | null;

  @IsOptional()
  @IsBoolean()
  instrumentConsole: boolean | null;

  @IsOptional()
  @IsBoolean()
  navigation: boolean | null;

  @IsOptional()
  @IsBoolean()
  geoFencing: boolean | null;
}

export class UpdateComfortAndConvenienceDto extends ComfortAndConvenienceDto {
  @IsOptional()
  @IsString()
  id: string;
}
