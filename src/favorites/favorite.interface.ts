import { Pagination } from '../utils/interfaces/pagination.interface';
import { User } from '../users/user.interface';
import { VehicleInterface } from '../vehicles/vehicle.interface';

export interface FavoriteInterface {
  id: string;
  isFavorite: boolean;
  vehicle: VehicleInterface;
  user: User;
}

export interface AllFav {
  favorite: Array<FavoriteInterface>;
  pagination: Pagination;
}
