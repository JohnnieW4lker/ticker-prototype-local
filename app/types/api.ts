// API Types

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// WebSocket message types
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

export interface StockUpdateMessage extends WebSocketMessage {
  type: 'stock.update';
  payload: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  };
}

export interface MarketStatusMessage extends WebSocketMessage {
  type: 'market.status';
  payload: {
    isOpen: boolean;
    nextOpen?: string;
    nextClose?: string;
  };
}

export interface EventReminderMessage extends WebSocketMessage {
  type: 'event.reminder';
  payload: {
    eventId: string;
    eventType: string;
    symbol?: string;
    message: string;
    minutesUntil: number;
  };
}

// API endpoint types
export interface StockListParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
  search?: string;
}

export interface StockHistoryParams {
  symbol: string;
  from?: string;
  to?: string;
  interval?: '1d' | '1w' | '1m';
}

export interface FilterParams extends Record<string, any> {
  // Dynamic filter parameters
}
