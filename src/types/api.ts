export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string | null;
  data: T;
  pagination?: PaginationMeta;
  errors?: string | unknown;
};

export type PaginatedParams = {
  page?: number;
  pageSize?: number;
  search?: string;
};
