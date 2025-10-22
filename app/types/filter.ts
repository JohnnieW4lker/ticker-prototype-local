// Filter Types

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn';

export type SortDirection = 'asc' | 'desc';

export interface FilterCondition {
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For 'between' operator
}

export interface FilterGroup {
  operator: 'and' | 'or';
  conditions: (FilterCondition | FilterGroup)[];
}

export interface BasicFilter {
  assetTypes?: string[];
  exchanges?: string[];
  sectors?: string[];
  industries?: string[];
  minMarketCap?: number;
  maxMarketCap?: number;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  minDividendYield?: number;
}

export interface AdvancedFilter extends BasicFilter {
  minPE?: number;
  maxPE?: number;
  minEPS?: number;
  maxEPS?: number;
  minROE?: number;
  maxROE?: number;
  minROA?: number;
  maxROA?: number;
  minCurrentRatio?: number;
  maxCurrentRatio?: number;
  minDebtToEquity?: number;
  maxDebtToEquity?: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: AdvancedFilter;
  isPublic: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SortConfig {
  field: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalItems?: number;
  totalPages?: number;
}

export interface FilterResult {
  stocks: import('./stock').Stock[];
  pagination: PaginationConfig;
  appliedFilters: AdvancedFilter;
  sort?: SortConfig;
}

// Predefined filter presets
export const PRESET_FILTERS = {
  HIGH_DIVIDEND: 'high_dividend',
  HIGH_EPS: 'high_eps',
  UNDERVALUED: 'undervalued',
  GROWTH: 'growth',
  LARGE_CAP: 'large_cap',
  SMALL_CAP: 'small_cap',
  TECH_LEADERS: 'tech_leaders',
} as const;
