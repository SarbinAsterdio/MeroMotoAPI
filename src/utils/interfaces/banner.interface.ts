import { PageName } from '../common/common.enum';
import { Pagination } from './pagination.interface';

export interface BannerInterface {
  id: string;
  image: string;
  title: string;
  description: string;
  link: string;
  buttonText: string;
  section: string;
  hexCode: string;
  status: boolean;
  pageName: PageName;
  createdAt: Date;
  webImage: string;
  tabImage: string;
  mobileImage: string;
  customizable: boolean;
}

export interface BannerWithPagination {
  banners: Array<BannerInterface>;
  pagination: Pagination;
}
