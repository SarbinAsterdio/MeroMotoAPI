import {
  SteeringType,
  SteeringGearType,
  RearSuspensionSystem,
  FrontSuspensionSystem,
  BrakeType,
  FrameDesign,
} from '../common/variant.enum';

export interface SuspensionSteeringAndBrakeInterface {
  id: string;
  steeringType: SteeringType | null;
  steeringGearType: SteeringGearType | null;
  steeringColumn: string | null;
  minimumTurningRadius: number | null;
  rearSuspension: RearSuspensionSystem | null;
  frontSuspension: FrontSuspensionSystem | null;
  frontBrakeType: BrakeType | null;
  rearBrakeType: BrakeType | null;
  shockAbsorbersType: string | null;
  bodyType: string | null;
  platform: string | null;
  frame: FrameDesign | null;
  frontBrakeDiameter: number | null;
  rearBrakeDiameter: number | null;
  radialTyre: boolean | null;
  tyreSize: string | null;
  wheelSize: number | null;
  wheelType: string | null;
  tubelessTyre: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
