export interface PaginatedContainer<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  results: Array<T>;
}
