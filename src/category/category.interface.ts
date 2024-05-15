import { CatType } from '../utils/common';
import { Pagination } from '../utils/interfaces/pagination.interface';

export interface CategoryInterface {
  id: string;
  name: string;
  image: string;
  icon: string;
  featured: boolean;
  searchable: boolean;
  slug: string;
  type: CatType;
}

export interface AllCategories {
  categories: Array<CategoryInterface>;
  pagination: Pagination;
}
