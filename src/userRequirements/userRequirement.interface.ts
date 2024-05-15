import { VehicleCondition } from '../utils/common/common.enum';
import { Pagination } from '../utils/interfaces/pagination.interface';
import { User } from '../users/user.interface';

export interface VehicleRequirementInterface {
  id: string;
  condition: VehicleCondition;
  description: string;
  year: number;
  transmission: string;
  minBudget: number;
  maxBudget: number;
  name: string;
  email: string;
  phoneNumber: string;
  remarks: string;
}

export interface VehicleRequirementPopulated
  extends Omit<
    VehicleRequirementInterface,
    'category' | 'model' | 'brand' | 'user'
  > {
  category: { id: string; name: string; slug: string };
  model: { id: string; model: string; slug: string };
  brand: { id: string; brand: string; slug: string };
  user: User;
}
export interface AllVehicleRequirements {
  results: Array<VehicleRequirementPopulated>;
  pagination: Pagination;
}
