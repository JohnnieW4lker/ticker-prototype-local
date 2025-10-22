// Event Types

export type EventType = 'earnings' | 'dividend' | 'economics' | 'ipo' | 'split';

export interface Event {
  id: string;
  type: EventType;
  symbol?: string;
  name: string;
  date: string;
  time?: string;
  description?: string;
  details?: Record<string, any>;
}

export interface EarningsEvent extends Event {
  type: 'earnings';
  symbol: string;
  fiscalQuarter: string;
  fiscalYear: number;
  estimatedEPS?: number;
  actualEPS?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
}

export interface DividendEvent extends Event {
  type: 'dividend';
  symbol: string;
  amount: number;
  exDate: string;
  paymentDate: string;
  recordDate: string;
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
}

export interface EconomicEvent extends Event {
  type: 'economics';
  indicator: string;
  country: string;
  impact: 'low' | 'medium' | 'high';
  forecast?: number;
  actual?: number;
  previous?: number;
}

export interface IPOEvent extends Event {
  type: 'ipo';
  symbol: string;
  company: string;
  exchange: string;
  priceRange?: {
    low: number;
    high: number;
  };
  sharesOffered?: number;
}

export interface SplitEvent extends Event {
  type: 'split';
  symbol: string;
  ratio: string; // e.g., "2:1", "3:2"
  effectiveDate: string;
}

export interface CalendarDay {
  date: string;
  events: Event[];
  eventCounts: Record<EventType, number>;
}

export interface EventFilter {
  types: EventType[];
  startDate: string;
  endDate: string;
  symbols?: string[];
}
