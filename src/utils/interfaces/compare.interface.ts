import { CompareType } from '../common';
import { Pagination } from './pagination.interface';
import { VariantInterface } from '../../variants/variant.interface';

export interface CompareInterface {
  id: string;
  featured: boolean;
  type: CompareType;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompareWithVariants
  extends Omit<CompareInterface, 'variants'> {
  variants: Array<VariantInterface>;
}

export interface AllComparisions {
  comparisions: Array<CompareWithVariants>;
  pagination: Pagination;
}
