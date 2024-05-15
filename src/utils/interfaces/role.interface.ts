export interface RoleInterface {
  id: string;
  name: string;
  createdAt: Date;
}

export interface AllRole {
  roles: Array<RoleInterface>;
}
