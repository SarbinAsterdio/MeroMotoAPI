import { Pagination } from '../utils/interfaces/pagination.interface';
import { User } from '../users/user.interface';
import { VehicleInterface } from '../vehicles/vehicle.interface';

export interface RatingInterface {
  id: string;
  name: string;
  // vehicleId: VehicleInterface;
  mobileNumber: string;
  reviewMessage: string;
  rating: number;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AllRating {
  reviews: Array<RatingInterface>;
  pagination: Pagination;
}

export interface RatingWithUserAndVehicle
  extends Omit<RatingInterface, 'user | vehicleId'> {
  user: User;
  vehicleId: VehicleInterface;
}
