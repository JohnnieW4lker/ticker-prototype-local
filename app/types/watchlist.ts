// Watchlist Types

import type { Stock } from './stock';

export interface Watchlist {
  id: string;
  name: string;
  description?: string;
  stocks: string[]; // Array of stock symbols
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  shareUrl?: string;
}

export interface WatchlistWithData extends Watchlist {
  stockData: Stock[];
}

export interface WatchlistPerformance {
  watchlistId: string;
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  bestPerformer: {
    symbol: string;
    changePercent: number;
  };
  worstPerformer: {
    symbol: string;
    changePercent: number;
  };
}

export interface WatchlistSettings {
  columns: string[];
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  timePeriod: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '2Y';
}

export const DEFAULT_WATCHLIST_COLUMNS = [
  'symbol',
  'name',
  'price',
  'change',
  'changePercent',
  'volume',
  'marketCap',
  'pe',
  'dividendYield',
] as const;

export const AVAILABLE_WATCHLIST_COLUMNS = [
  ...DEFAULT_WATCHLIST_COLUMNS,
  'eps',
  'fiftyTwoWeekHigh',
  'fiftyTwoWeekLow',
  'sector',
  'industry',
  'nextEarningsDate',
] as const;
