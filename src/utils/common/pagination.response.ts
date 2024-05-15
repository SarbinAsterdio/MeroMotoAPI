import { SelectQueryBuilder } from 'typeorm';
import { Pagination } from '../interfaces/pagination.interface';

// for pagination
export const applyPagination = async <T>(
  query: SelectQueryBuilder<T>,
  page: number,
  limit: number,
  total: number,
): Promise<{ pagination: Pagination; query: SelectQueryBuilder<T> }> => {
  const currentPage = Number(page || 1);
  const currentLimit = Number(limit || 50);
  query.skip((currentPage - 1) * currentLimit);
  query.take(currentLimit);
  // const pagination = paginationResponse(currentPage, currentLimit, total);
  const totalPage = Math.ceil(total / currentLimit);
  const pagination: Pagination = { page, limit, totalPage, total };
  return { pagination, query };
};

//for sorting
export const applySort = async <T>(
  queryBuilder: SelectQueryBuilder<T>,
  field: string,
  alias: string,
): Promise<SelectQueryBuilder<T>> => {
  let order: 'ASC' | 'DESC' = 'DESC';

  if (field.startsWith('-')) {
    field = field.slice(1);
  } else {
    order = 'ASC';
  }
  queryBuilder.orderBy(`${alias}.${field}`, order);
  return queryBuilder;
};
