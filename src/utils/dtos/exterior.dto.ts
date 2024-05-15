import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  HeadlightType,
  TailLightType,
  TurnSignalType,
} from '../common/variant.enum';

export class ExteriorDto {
  @IsOptional()
  @IsBoolean()
  rearWindowWiper: boolean | null;

  @IsOptional()
  @IsBoolean()
  lowBatteryIndicator: boolean | null;

  @IsOptional()
  @IsBoolean()
  drl: boolean | null;

  @IsOptional()
  @IsBoolean()
  adjustableHeadlights: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearWindowWasher: boolean | null;

  @IsOptional()
  @IsBoolean()
  fogLightsFront: boolean | null;

  @IsOptional()
  @IsBoolean()
  powerAdjustableExteriorRearViewMirror: boolean | null;

  @IsOptional()
  @IsBoolean()
  manuallyAdjustableExtRearViewMirror: boolean | null;

  @IsOptional()
  @IsBoolean()
  electricFoldingRearViewMirror: boolean | null;

  @IsOptional()
  @IsBoolean()
  rainSensingWiper: boolean | null;

  @IsOptional()
  @IsBoolean()
  rearWindowDefogger: boolean | null;

  @IsOptional()
  @IsBoolean()
  wheelCovers: boolean | null;

  @IsOptional()
  @IsBoolean()
  alloyWheels: boolean | null;

  @IsOptional()
  @IsBoolean()
  powerAntenna: boolean | null;

  @IsOptional()
  @IsBoolean()
  tintedGlass: boolean | null;

  @IsOptional()
  @IsBoolean()
  outsideRearViewMirrorTurnIndicators: boolean | null;

  @IsOptional()
  @IsBoolean()
  intergratedAntenna: boolean | null;

  @IsOptional()
  @IsBoolean()
  chromeGrille: boolean | null;

  @IsOptional()
  @IsBoolean()
  chromeGarnish: boolean | null;

  @IsOptional()
  @IsBoolean()
  projectorHeadlamps: boolean | null;

  @IsOptional()
  @IsBoolean()
  halogenHeadlamps: boolean | null;

  @IsOptional()
  @IsBoolean()
  ledDRL: boolean | null;

  @IsOptional()
  @IsEnum(TailLightType)
  tailLight: TailLightType;

  @IsOptional()
  @IsEnum(HeadlightType)
  headLight: HeadlightType;

  @IsOptional()
  @IsEnum(TurnSignalType)
  turnSignalLamp: TurnSignalType;

  @IsOptional()
  @IsBoolean()
  ledTailLight: boolean | null;

  @IsArray()
  @IsOptional()
  images?: Array<string>;

  @IsOptional()
  @IsArray()
  additionalFeatures: Array<string> | null;
}

export class UpdateExteriorDto extends ExteriorDto {
  @IsOptional()
  @IsString()
  id: string;
}
