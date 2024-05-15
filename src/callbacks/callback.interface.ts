import { BrandInterface } from '../brands/brand.interface';
import { Pagination } from '../utils/interfaces/pagination.interface';
import { VehicleInterface } from '../vehicles/vehicle.interface';

export interface CallBackInterface {
  id: string;
  name: string;
  phoneNumber: string;
  verified: boolean;
  remarks: string;
}

export interface CallBackPopulated
  extends Omit<CallBackInterface, 'vehicle' | 'brand'> {
  vehicle: VehicleInterface;
  brand: BrandInterface;
}

export interface CallBacksWithPagination {
  callbacks: Array<CallBackPopulated>;
  pagination: Pagination;
}
