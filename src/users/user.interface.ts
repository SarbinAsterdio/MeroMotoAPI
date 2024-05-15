import { Pagination } from '../utils/interfaces/pagination.interface';
import { RoleInterface } from '../utils/interfaces/role.interface';

export interface User {
  id: string;
  name: string;
  slug: string;
  email: string;
  phoneNumber: string;
  image: string;
  address: string;
  bio: string;
  role: any;
  newUser: boolean;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  createdAt: Date;
}

export interface UserWithRole extends Omit<User, 'role'> {
  role: RoleInterface;
}

export interface AllUsers {
  users: Array<UserWithRole>;
  pagination: Pagination;
}
