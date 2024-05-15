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

export interface EngineAndTransmissionInterface {
  id: string;
  engineType: EngineType | null;
  transmission: Transmission | null;
  engineDisplacement: number | null;
  mileage: number | null;
  noOfCylinder: NumberOfCylinders | null;
  valvesPerCylinder: ValvesPerCylinder | null;
  maximumTorque: number | null;
  torqueRPM: number | null;
  powerRPM: number | null;
  maximumPower: number | null;
  gearBox: GearBox | null;
  driveType: DriveType | null;
  coolingSystem: CoolingSystem | null;
  starting: Starting | null;
  fuelSupply: FuelSupply | null;
  clutch: ClutchType | null;
  bore: number | null;
  stroke: number | null;
  compressionRatio: string | null;
  emmissionType: string | null;
  batteryCapacity: number | null;
  motorType: string | null;
  motorPower: number | null;
  range: number | null;
  chargingTimeAC: number | null;
  chargingTimeDC: number | null;
  chargingTime0to80: number | null;
  chargingTime0to100: number | null;
  fastCharging: boolean | null;
  chargingPort: string | null;
  trim: Trim | null;
  createdAt: Date;
  updatedAt: Date;
}
