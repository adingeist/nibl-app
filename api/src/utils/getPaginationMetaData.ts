import { PaginationRes } from '@shared/types/dto/Pagination';
import { ApiError } from '@src/utils/ApiError';

export const getPaginationMetaData = (
  page: number,
  take: number,
  totalCount: number,
): PaginationRes => {
  if (take === 0) {
    throw new ApiError(
      500,
      `Items per page in pagination equals 0. Validate endpoint input to prevent this.`,
    );
  }

  return {
    page,
    pageCount: Math.ceil(totalCount / take),
    perPage: take,
    totalCount,
  };
};
