import { NavItemType } from '../common/common.enum';
import { NavItemChildInterface } from './navItem-child.interface';
import { Pagination } from './pagination.interface';

export interface NavItemInterface {
  id: string;
  title: string;
  link: string;
  featured: boolean;
  position: number;
  type: NavItemType;
}

export interface NavItemPopulated
  extends Omit<NavItemInterface, 'navItemChilds'> {
  navItemChilds: Array<NavItemChildInterface>;
}

export interface AllNavItems {
  navItems: Array<NavItemPopulated>;
  pagination: Pagination;
}
