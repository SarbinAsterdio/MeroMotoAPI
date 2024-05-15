import { AdColumnType, PageName } from '../common/common.enum';
import { Pagination } from './pagination.interface';

export interface AdInterface {
  id: string;
  webImage: string;
  mobileImage: string;
  column: AdColumnType;
  position: number;
  pageName: PageName;
  link: string;
  status: boolean;
  default: boolean;
  startDateAndTime: Date;
  endDateAndTime: Date;
  createdAt: Date;
}
export interface AdWithPagination {
  ad: Array<AdInterface>;
  pagination: Pagination;
}
