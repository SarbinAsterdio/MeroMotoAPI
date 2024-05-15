import { VehicleCondition } from '../common/common.enum';
import { Pagination } from './pagination.interface';
import { User } from '../../users/user.interface';

export interface VehicleDetailInterface {
  id: string;
  condition: VehicleCondition;
  description: string;
  year: number;
  transmission: string;
  images: Array<string>;
  phoneNumber: string;
  name: string;
  email: string;
}

export interface VehicleDetailPopulated
  extends Omit<
    VehicleDetailInterface,
    'category' | 'model' | 'brand' | 'user'
  > {
  category: { id: string; name: string; slug: string };
  model: { id: string; model: string; slug: string };
  brand: { id: string; brand: string; slug: string };
  user: User;
}
export interface AllVehicleDetails {
  results: Array<VehicleDetailPopulated>;
  pagination: Pagination;
}
