export class PaginatedResponseDto<T> {
  data!: T[];
  meta!: {
    totalPages: number;
  };
}
