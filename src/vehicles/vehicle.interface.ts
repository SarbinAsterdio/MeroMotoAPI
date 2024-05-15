import {
  CatType,
  UsedVehicleCondition,
  VehicleCondition,
  VehicleOwner,
} from '../utils/common/common.enum';
import { AvailableColorInterface } from '../availableColors/availableColor.interface';
import { BodyTypeInterface } from '../bodyTypes/bodyType.interface';
import { BrandInterface } from '../brands/brand.interface';
import { ModelInterface } from '../utils/interfaces/model.interface';
import { Pagination } from '../utils/interfaces/pagination.interface';

export interface VehicleInterface {
  id: string;
  name: string;
  type: CatType;
  slug: string;
  totalView: number;
  totalSearch: number;
  condition: VehicleCondition;
  featured: boolean;
  description: string;
  minPrice: number;
  maxPrice: number;
  position: number;
  year: number;
  images: Array<string>;
  variantImages: Array<string>;
  exteriorImages: Array<string>;
  interiorImages: Array<string>;

  maxMileage: number;
  minMileage: number;
  usedVehicleTotalMileage: number;
  maxEngineDisplacement: number;
  minEngineDisplacement: number;
  batteryRange: number;
  batteryCapacity: number;
  transmission: Array<string>;
  certified: boolean | null;
  approved: boolean | null;
  minBHP: number;
  maxBHP: number;
  seats: number;
  torque: number;
  topSpeed: number;
  brakes: Array<string> | null;
  tyreType: string | null;
  fuelTank: number;
  fuelType: Array<string> | null;
  bootSpace: number | null;
  trim: Array<string>;
  upcoming: boolean;
  expectedLaunchDate: Date;

  chargingTime0to80: number | null;
  view360: string | null;
  video: string | null;
  location: string | null;
  registerYear: number | null;
  motorPower: number | null;
  motor: string | null;
  acceleration: string | null;
  features: Array<string>;
  blueBookImages: Array<string>;
  roadTaxImages: Array<string>;
  insuranceImages: Array<string>;
  isElectric: boolean;
  vehicleCondition: UsedVehicleCondition;
  vehicleOwner: VehicleOwner;
}

export interface VehiclePopulated
  extends Omit<
    VehicleInterface,
    'category' | 'model' | 'brand' | 'variant' | 'availableColors' | 'bodyType'
  > {
  category: { id: string; name: string };
  model: ModelInterface;
  brand: BrandInterface;
  variants: Array<{
    id: string;
    variant: string;
    slug: string;
    image: string;
    baseVariant: boolean;
  }>;
  availableColors: Array<AvailableColorInterface>;
  bodyType: BodyTypeInterface;
}
export interface AllVehicles {
  vehicles: Array<VehiclePopulated>;
  pagination: Pagination;
}

export interface PopularUsedVehicles {
  [key: string]: Array<string>;
}

export interface HomePageElectric {
  name: string;
  slug: string;
  minPrice: number;
  maxPrice: number;
  images: Array<string>;
  usedVehicleTotalMileage: number;
  batteryRange: number;
  batteryCapacity: number;
  transmission: Array<string>;
  condition: VehicleCondition;
}

export interface HomePageVehicle extends HomePageElectric {
  year: number;
  maxMileage: number;
  minMileage: number;
  maxEngineDisplacement: number;
  minEngineDisplacement: number;
}

export interface priceRange {
  minPrice: number;
  maxPrice: number | string;
  label: string;
}

export interface VehicleImageInterface {
  id: string;
  slug: string;
  images: string[];
  exteriorImages: string[];
  interiorImages: string[];
  view360: string | null;
  video: string | null;
  availableColors: AvailableColorInterface[];
}
