import { Pagination } from '../utils/interfaces/pagination.interface';

export interface ColorInterface {
  id: string;
  name: string;
  slug: string;
  hexCode: string;
  createdAt: Date;
}

export interface AllColor {
  colors: Array<ColorInterface>;
  pagination: Pagination;
}
