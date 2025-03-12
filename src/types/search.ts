export interface SearchFilters {
  search?: string;
  titleType?: string;
  genres?: string[];
  startYear?: number;
  endYear?: number;
  ratingRange?: [number, number];
  isAdult?: boolean;
  runtimeRange?: [number, number];
  language?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 