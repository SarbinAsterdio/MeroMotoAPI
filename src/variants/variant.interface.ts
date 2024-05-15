import { CategoryInterface } from '../category/category.interface';
import { ComfortAndConvenienceInterface } from '../utils/interfaces/comfort-and-convenience.interface';
import { DimensionAndCapacityInterface } from '../utils/interfaces/dimension-and-capacity.interface';
import { EngineAndTransmissionInterface } from '../utils/interfaces/engine-and-transmission.interface';
import { EntertainmentAndCommunicationInterface } from '../utils/interfaces/entertainment-and-communication.interface';
import { ExteriorInterface } from '../utils/interfaces/exterior.interface';
import { FuelAndPerformanceInterface } from '../utils/interfaces/fuel-and-performance.interface';
import { InteriorInterface } from '../utils/interfaces/interior.interface';
import { ModelInterface } from '../utils/interfaces/model.interface';
import { MotorAndBatteryInterface } from '../utils/interfaces/motor-and-battery.interface';
import { Pagination } from '../utils/interfaces/pagination.interface';
import { SafetyAndFeaturesInterface } from '../utils/interfaces/safety-and-features.interface';
import { SuspensionSteeringAndBrakeInterface } from '../utils/interfaces/suspension-steering-and-brake.interface';

export interface VariantInterface {
  id: string;
  variant: string;
  slug: string;
  image: string;
  totalView: number;
  description: string;
  createdAt: Date;
  price: number;
  featured: boolean;
  baseVariant: boolean;
}

export interface VariantWithSpecs
  extends Omit<
    VariantInterface,
    | 'engineAndTransmission'
    | 'fuelAndPerformance'
    | 'suspensionSteeringAndBrake'
    | 'dimensionAndCapacity'
    | 'entertainmentAndCommunication'
    | 'motorAndBattery'
    | 'comfortAndConvenience'
    | 'interior'
    | 'exterior'
    | 'safetyAndFeatures'
  > {
  engineAndTransmission: EngineAndTransmissionInterface;

  fuelAndPerformance: FuelAndPerformanceInterface;

  suspensionSteeringAndBrake: SuspensionSteeringAndBrakeInterface;

  dimensionAndCapacity: DimensionAndCapacityInterface;

  motorAndBattery: MotorAndBatteryInterface;

  comfortAndConvenience: ComfortAndConvenienceInterface;

  interior: InteriorInterface;

  exterior: ExteriorInterface;

  safetyAndFeatures: SafetyAndFeaturesInterface;

  entertainmentAndCommunication: EntertainmentAndCommunicationInterface;
}
export interface VariantPopulated
  extends Omit<VariantWithSpecs, 'category' | 'model'> {
  category: CategoryInterface;
  model: ModelInterface;
}

export interface ALlVariants {
  variants: Array<VariantPopulated>;
  pagination: Pagination;
}
