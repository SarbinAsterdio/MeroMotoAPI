import { CompareInterface } from './compare.interface';
import { User } from '../../users/user.interface';

export interface CompareFavouriteInterface {
  id: string;
  user: User;
  compare: CompareInterface;
  createdAt: Date;
  updatedAt: Date;
}
