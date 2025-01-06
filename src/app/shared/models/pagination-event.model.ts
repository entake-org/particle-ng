/**
 * Representation of a pagination event
 */
export interface PaginationEvent {
  activePage: number;
  pageSize: number;
  totalLength: number;
}
