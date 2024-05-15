import {
  TailLightType,
  HeadlightType,
  TurnSignalType,
} from '../common/variant.enum';

export interface ExteriorInterface {
  id: string;
  adjustableHeadlights: boolean | null;
  fogLightsFront: boolean | null;
  powerAdjustableExteriorRearViewMirror: boolean | null;
  manuallyAdjustableExtRearViewMirror: boolean | null;
  electricFoldingRearViewMirror: boolean | null;
  rainSensingWiper: boolean | null;
  rearWindowWiper: boolean | null;
  rearWindowWasher: boolean | null;
  rearWindowDefogger: boolean | null;
  wheelCovers: boolean | null;
  alloyWheels: boolean | null;
  powerAntenna: boolean | null;
  tintedGlass: boolean | null;
  outsideRearViewMirrorTurnIndicators: boolean | null;
  intergratedAntenna: boolean | null;
  chromeGrille: boolean | null;
  chromeGarnish: boolean | null;
  projectorHeadlamps: boolean | null;
  halogenHeadlamps: boolean | null;
  ledDRL: boolean | null;
  drl: boolean | null;
  tailLight: TailLightType | null;
  headLight: HeadlightType | null;
  turnSignalLamp: TurnSignalType | null;
  ledTailLight: boolean | null;
  lowBatteryIndicator: boolean | null;
  images: Array<string> | null;
  additionalFeatures: string[] | null;
  createdAt: Date;
  updatedAt: Date;
}
