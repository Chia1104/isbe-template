export interface ErrorResponse {
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedMeta {
  totalRows: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
}

export interface Paginated<T = unknown> {
  data: T[];
  meta: PaginatedMeta;
}
