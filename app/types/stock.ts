// Stock Data Types

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number | null;
  eps: number | null;
  dividendYield: number | null;
  dividendRate: number | null;
  exDividendDate: string | null;
  nextEarningsDate: string | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  industry: string;
  sector: string;
  employees: number | null;
  ceo: string | null;
  website: string | null;
}

export interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface FinancialStatement {
  period: string;
  reportDate: string;
  revenue: number | null;
  costOfRevenue: number | null;
  grossProfit: number | null;
  operatingExpense: number | null;
  operatingIncome: number | null;
  netIncome: number | null;
  eps: number | null;
  ebitda: number | null;
}

export interface BalanceSheet {
  period: string;
  reportDate: string;
  totalAssets: number | null;
  totalLiabilities: number | null;
  totalEquity: number | null;
  currentAssets: number | null;
  currentLiabilities: number | null;
  cash: number | null;
  debt: number | null;
}

export interface CashFlow {
  period: string;
  reportDate: string;
  operatingCashFlow: number | null;
  investingCashFlow: number | null;
  financingCashFlow: number | null;
  freeCashFlow: number | null;
  capitalExpenditures: number | null;
}

export interface FundamentalAnalysis {
  overallScore: number;
  profitabilityScore: number;
  debtScore: number;
  liquidityScore: number;
  performanceScore: number;
  roe: number | null;
  roa: number | null;
  ros: number | null;
  debtToEquity: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
}

export interface CompanyInfo {
  symbol: string;
  name: string;
  description: string;
  ceo: string | null;
  employees: number | null;
  headquarters: string | null;
  founded: number | null;
  website: string | null;
  industry: string;
  sector: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface StockPerformance {
  oneDay: number;
  fiveDays: number;
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  twoYears: number;
}
