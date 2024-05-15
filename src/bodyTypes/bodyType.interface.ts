import { Pagination } from '../utils/interfaces/pagination.interface';

export interface BodyTypeInterface {
  id: string;
  bodyType: string;
  slug: string;
  image: string;
  createdAt: Date;
}

export interface BodyTypeWithCategory
  extends Omit<BodyTypeInterface, 'categories'> {
  categories: Array<{ id: string; name: string }>;
}

export interface AllBodyType {
  bodyTypes: Array<BodyTypeWithCategory>;
  pagination: Pagination;
}
