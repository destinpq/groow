import { parsePaginationParams, calculateSkip, createPaginationResult } from '../utils/pagination.util';

describe('PaginationUtil', () => {
  describe('parsePaginationParams', () => {
    it('should return default values when inputs are invalid', () => {
      const result = parsePaginationParams(null, null);
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should parse string values correctly', () => {
      const result = parsePaginationParams('5', '20');
      expect(result).toEqual({ page: 5, limit: 20 });
    });

    it('should clamp limit to maximum value', () => {
      const result = parsePaginationParams('1', '200', 10, 100);
      expect(result).toEqual({ page: 1, limit: 100 });
    });

    it('should handle negative values', () => {
      const result = parsePaginationParams('-1', '-5');
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should handle zero values', () => {
      const result = parsePaginationParams('0', '0');
      expect(result).toEqual({ page: 1, limit: 10 });
    });

    it('should handle non-numeric strings', () => {
      const result = parsePaginationParams('abc', 'xyz');
      expect(result).toEqual({ page: 1, limit: 10 });
    });
  });

  describe('calculateSkip', () => {
    it('should calculate skip value correctly', () => {
      expect(calculateSkip(1, 10)).toBe(0);
      expect(calculateSkip(2, 10)).toBe(10);
      expect(calculateSkip(5, 20)).toBe(80);
    });
  });

  describe('createPaginationResult', () => {
    it('should create pagination metadata correctly', () => {
      const result = createPaginationResult(95, 2, 10);
      expect(result).toEqual({
        total: 95,
        page: 2,
        limit: 10,
        totalPages: 10,
      });
    });

    it('should handle exact division', () => {
      const result = createPaginationResult(100, 1, 10);
      expect(result).toEqual({
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
      });
    });

    it('should handle empty results', () => {
      const result = createPaginationResult(0, 1, 10);
      expect(result).toEqual({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });
  });
});