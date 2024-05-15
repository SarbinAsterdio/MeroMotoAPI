import { PageName, DynamicContentType } from '../common/common.enum';
import { Pagination } from './pagination.interface';

export interface DescriptionInterface {
  id: string;
  slug: string;
  title: string;
  description: string;
  pageName: PageName;
  type: DynamicContentType;
}

export interface DescriptionWithPagination {
  descriptions: Array<DescriptionInterface>;
  pagination: Pagination;
}
