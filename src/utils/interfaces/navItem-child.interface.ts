import { NavItemChildType } from '../common/common.enum';
import { NavItemInterface } from './navItem.interface';
import { Pagination } from './pagination.interface';

export interface NavItemChildInterface {
  id: string;
  title: string;
  link: string;
  featured: boolean;
  position: number;
  type: NavItemChildType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: Array<any>;
}

export interface NavItemChildPopulated
  extends Omit<NavItemChildInterface, 'navItems'> {
  navItem: NavItemInterface;
}

export interface AllNavItemChilds {
  navItems: Array<NavItemChildPopulated>;
  pagination: Pagination;
}
