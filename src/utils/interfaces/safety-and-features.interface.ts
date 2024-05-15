import { AirBags, BrakeType } from '../common/variant.enum';

export interface SafetyAndFeaturesInterface {
  id: string;
  antiLockBrakingSystem: boolean | null;
  centralLocking: boolean | null;
  childSafetyLocks: boolean | null;
  seatType: string | null;
  powerDoorLocks: boolean | null;
  noOfAirbags: AirBags | null;
  driverAirbag: boolean | null;
  passengerAirbag: boolean | null;
  dayAndNightRearViewMirror: boolean | null;
  passengerSideRearViewMirror: boolean | null;
  seatBeltWarning: boolean | null;
  rearSeatBelts: boolean | null;
  doorAjarWarning: boolean | null;
  adjustableSeats: boolean | null;
  engineImmobilizer: boolean | null;
  crashSensor: boolean | null;
  engineCheckWarning: boolean | null;
  tyrePressureMonitor: boolean | null;
  automaticHeadlamps: boolean | null;
  EBD: boolean | null;
  speedAlert: boolean | null;
  advanceSafetyFeatures: boolean | null;
  followMeHomeHeadlamps: boolean | null;
  rearCamera: boolean | null;
  speedSensingAutoDoorLock: boolean | null;
  impactSensingAutoDoorUnlock: boolean | null;
  pretensionersAndForceLimiterSeatbelts: boolean | null;
  brakingType: BrakeType | null;
  chargingPoint: string | null;
  artificialExaustSoundSystem: boolean | null;
  bodyGraphics: boolean | null;
  createdAt: Date;
  updatedAt: Date;
}
