import { FuelType } from '../common/variant.enum';

export interface FuelAndPerformanceInterface {
  id: string;
  fuelType: FuelType | null;
  cngMileage: number | null;
  cngHighwayMileage: number | null;
  emissionNormCompliance: string | null;
  topSpeed: number | null;
  acceleration: number | null;
  createdAt: Date;
  updatedAt: Date;
}
