import { AvailableColorInterface } from '../../availableColors/availableColor.interface';
import { BodyTypeInterface } from '../../bodyTypes/bodyType.interface';
import { BrandInterface } from '../../brands/brand.interface';
import { CategoryInterface } from '../../category/category.interface';
import { Pagination } from './pagination.interface';

export interface ModelInterface {
  id: string;
  model: string;
  slug: string;
  totalView: number;
  createdAt: Date;
  year: number;
  isElectric: boolean;
}

export interface ModelPopulated
  extends Omit<
    ModelInterface,
    'category' | 'brand' | 'bodyType' | 'availableColors'
  > {
  category: Array<CategoryInterface>;
  brand: BrandInterface;
  availableColors: Array<AvailableColorInterface>;
  bodyType: BodyTypeInterface;
}

export interface ALlModels {
  models: Array<ModelPopulated>;
  pagination: Pagination;
}
