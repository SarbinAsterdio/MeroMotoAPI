import { RoleInterface, User } from 'src/utils/interfaces';

export interface JwtPayload {
  userId: string;
}

export interface AdminInterface {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  slug: string;
  role: string;
}

export interface AdminWithRoleInterface extends Omit<AdminInterface, 'role'> {
  role: RoleInterface;
}

export interface AdminResInterface {
  user: AdminInterface;
  token: string;
}

export interface UserResInterface {
  user: User;
}

export interface UserTokenResInterface {
  user: AdminInterface;
  token: string;
}

export interface GuestResInterface {
  token: string;
}
