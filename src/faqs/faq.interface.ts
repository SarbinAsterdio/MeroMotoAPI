import { BrandInterface } from '../brands/brand.interface';
import { ModelInterface } from '../utils/interfaces/model.interface';
import { Pagination } from '../utils/interfaces/pagination.interface';

export interface FaqInterface {
  id: string;
  brand: BrandInterface | object;
  model: ModelInterface | object;
  question: string;
  answer: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AllFaq {
  faq: Array<FaqInterface>;
  pagination: Pagination;
}

export interface getFaqByBrandOrModelInterface
  extends Omit<FaqInterface, 'brand' | 'model'> {
  brand: BrandInterface;
  model: ModelInterface;
}
