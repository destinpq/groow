/**
 * Utility functions for pagination handling
 */

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Parse and validate pagination parameters
 * @param page - Page number (as string or number)
 * @param limit - Limit per page (as string or number)
 * @param defaultLimit - Default limit if not provided or invalid
 * @param maxLimit - Maximum allowed limit
 * @returns Validated pagination parameters
 */
export function parsePaginationParams(
  page: any,
  limit: any,
  defaultLimit = 10,
  maxLimit = 100
): PaginationParams {
  const pageCandidate = parseInt(String(page), 10);
  const limitCandidate = parseInt(String(limit), 10);
  
  const validatedPage = Number.isFinite(pageCandidate) && pageCandidate > 0 ? pageCandidate : 1;
  const validatedLimit = Number.isFinite(limitCandidate) && limitCandidate > 0
    ? Math.min(limitCandidate, maxLimit)
    : defaultLimit;

  return {
    page: validatedPage,
    limit: validatedLimit
  };
}

/**
 * Calculate skip value for TypeORM pagination
 * @param page - Page number
 * @param limit - Items per page
 * @returns Skip value for database query
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Create pagination result object
 * @param total - Total number of items
 * @param page - Current page
 * @param limit - Items per page
 * @returns Pagination metadata
 */
export function createPaginationResult(
  total: number,
  page: number,
  limit: number
): PaginationResult {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}