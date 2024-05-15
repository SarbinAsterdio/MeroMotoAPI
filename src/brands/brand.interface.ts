import { Pagination } from '../utils/interfaces/pagination.interface';

export interface BrandInterface {
  id: string;
  brand: string;
  slug: string;
  image: string;
  createdAt: Date;
  totalView: number;
  description: string;
  featured: boolean;
  position: number;
}

export interface BrandWithCategory extends Omit<BrandInterface, 'categories'> {
  categories: Array<{ id: string; name: string }>;
}

export interface AllBrands {
  brands: Array<BrandWithCategory>;
  pagination: Pagination;
}
