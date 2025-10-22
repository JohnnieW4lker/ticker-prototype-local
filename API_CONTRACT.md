# TickerFilter API Contract

**Version:** 1.0.0
**Base URL:** `/api`
**Protocol:** REST + WebSocket
**Authentication:** JWT Bearer Token (future implementation)
**Date Format:** ISO 8601 (e.g., `2025-10-22T13:30:00Z`)

---

## Table of Contents

1. [Common Types](#common-types)
2. [Stock APIs](#stock-apis)
3. [Watchlist APIs](#watchlist-apis)
4. [Screener/Filter APIs](#screenerfilter-apis)
5. [Events APIs](#events-apis)
6. [Market Data APIs](#market-data-apis)
7. [WebSocket APIs](#websocket-apis)
8. [Error Handling](#error-handling)

---

## Common Types

### Standard Response Wrapper

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}
```

### Paginated Response

```typescript
interface PaginatedResponse<T> {
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
```

### Error Response

```typescript
interface ApiError {
  error: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}
```

---

## Stock APIs

### 1. Get Stock List

**Endpoint:** `GET /api/stocks`

**Query Parameters:**
```typescript
{
  page?: number;           // Default: 1
  pageSize?: number;       // Default: 50, Max: 200
  sort?: string;           // Field to sort by (e.g., "symbol", "marketCap", "price")
  direction?: 'asc' | 'desc';  // Default: 'asc'
  search?: string;         // Search by symbol or name
  sector?: string;         // Filter by sector
  industry?: string;       // Filter by industry
}
```

**Response:**
```typescript
ApiResponse<PaginatedResponse<Stock>>

interface Stock {
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
```

**Example:**
```bash
GET /api/stocks?page=1&pageSize=50&sort=marketCap&direction=desc&sector=Technology
```

---

### 2. Get Stock Details

**Endpoint:** `GET /api/stocks/:symbol`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol (e.g., "AAPL")

**Response:**
```typescript
ApiResponse<StockDetails>

interface StockDetails extends Stock {
  description: string;
  headquarters: string | null;
  founded: number | null;
  performance: StockPerformance;
}

interface StockPerformance {
  oneDay: number;
  fiveDays: number;
  oneMonth: number;
  threeMonths: number;
  sixMonths: number;
  oneYear: number;
  twoYears: number;
}
```

**Example:**
```bash
GET /api/stocks/AAPL
```

---

### 3. Get Stock Price History

**Endpoint:** `GET /api/stocks/:symbol/history`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol

**Query Parameters:**
```typescript
{
  from?: string;          // Start date (ISO 8601)
  to?: string;            // End date (ISO 8601)
  interval?: '1d' | '1w' | '1m';  // Default: '1d'
  period?: '5D' | '1M' | '3M' | '1Y' | '5Y';  // Alternative to from/to
}
```

**Response:**
```typescript
ApiResponse<PricePoint[]>

interface PricePoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
```

**Example:**
```bash
GET /api/stocks/AAPL/history?period=1M&interval=1d
```

---

### 4. Get Stock Financials

**Endpoint:** `GET /api/stocks/:symbol/financials`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol

**Query Parameters:**
```typescript
{
  type: 'income' | 'balance' | 'cashflow';
  period?: 'quarterly' | 'annual';  // Default: 'quarterly'
  limit?: number;                    // Default: 8
}
```

**Response:**

**For Income Statements:**
```typescript
ApiResponse<FinancialStatement[]>

interface FinancialStatement {
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
```

**For Balance Sheets:**
```typescript
ApiResponse<BalanceSheet[]>

interface BalanceSheet {
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
```

**For Cash Flow:**
```typescript
ApiResponse<CashFlow[]>

interface CashFlow {
  period: string;
  reportDate: string;
  operatingCashFlow: number | null;
  investingCashFlow: number | null;
  financingCashFlow: number | null;
  freeCashFlow: number | null;
  capitalExpenditures: number | null;
}
```

**Example:**
```bash
GET /api/stocks/AAPL/financials?type=income&period=quarterly&limit=4
```

---

### 5. Get Stock Fundamentals

**Endpoint:** `GET /api/stocks/:symbol/fundamentals`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol

**Response:**
```typescript
ApiResponse<FundamentalAnalysis>

interface FundamentalAnalysis {
  overallScore: number;      // 0-100
  profitabilityScore: number; // 0-100
  debtScore: number;         // 0-100
  liquidityScore: number;    // 0-100
  performanceScore: number;  // 0-100
  roe: number | null;        // Return on Equity
  roa: number | null;        // Return on Assets
  ros: number | null;        // Return on Sales
  debtToEquity: number | null;
  currentRatio: number | null;
  quickRatio: number | null;
}
```

**Example:**
```bash
GET /api/stocks/AAPL/fundamentals
```

---

### 6. Get Stock Company Info

**Endpoint:** `GET /api/stocks/:symbol/company`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol

**Response:**
```typescript
ApiResponse<CompanyInfo>

interface CompanyInfo {
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
```

**Example:**
```bash
GET /api/stocks/AAPL/company
```

---

### 7. Get Stock News

**Endpoint:** `GET /api/stocks/:symbol/news`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol

**Query Parameters:**
```typescript
{
  limit?: number;     // Default: 20, Max: 100
  offset?: number;    // Default: 0
  sentiment?: 'positive' | 'negative' | 'neutral';
}
```

**Response:**
```typescript
ApiResponse<NewsArticle[]>

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}
```

**Example:**
```bash
GET /api/stocks/AAPL/news?limit=10
```

---

### 8. Get Stock Events

**Endpoint:** `GET /api/stocks/:symbol/events`

**Path Parameters:**
- `symbol` (string): Stock ticker symbol

**Query Parameters:**
```typescript
{
  types?: EventType[];  // Filter by event types
  from?: string;        // Start date
  to?: string;          // End date
}
```

**Response:**
```typescript
ApiResponse<Event[]>

// See Events API section for Event interface
```

**Example:**
```bash
GET /api/stocks/AAPL/events?types=earnings,dividend
```

---

## Watchlist APIs

### 1. Get All Watchlists

**Endpoint:** `GET /api/watchlists`

**Response:**
```typescript
ApiResponse<Watchlist[]>

interface Watchlist {
  id: string;
  name: string;
  description?: string;
  stocks: string[];      // Array of stock symbols
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  shareUrl?: string;
}
```

**Example:**
```bash
GET /api/watchlists
```

---

### 2. Get Watchlist by ID

**Endpoint:** `GET /api/watchlists/:id`

**Path Parameters:**
- `id` (string): Watchlist ID

**Query Parameters:**
```typescript
{
  includeStockData?: boolean;  // Default: true, includes full stock details
}
```

**Response:**
```typescript
ApiResponse<WatchlistWithData>

interface WatchlistWithData extends Watchlist {
  stockData: Stock[];  // Full stock objects if includeStockData=true
}
```

**Example:**
```bash
GET /api/watchlists/sp500-top-10?includeStockData=true
```

---

### 3. Create Watchlist

**Endpoint:** `POST /api/watchlists`

**Request Body:**
```typescript
{
  name: string;           // Required, max 100 chars
  description?: string;   // Optional, max 500 chars
  stocks?: string[];      // Optional, array of stock symbols
  isPublic?: boolean;     // Default: false
}
```

**Response:**
```typescript
ApiResponse<Watchlist>
```

**Example:**
```bash
POST /api/watchlists
Content-Type: application/json

{
  "name": "Tech Giants",
  "description": "Major technology companies",
  "stocks": ["AAPL", "MSFT", "GOOGL"],
  "isPublic": false
}
```

---

### 4. Update Watchlist

**Endpoint:** `PUT /api/watchlists/:id`

**Path Parameters:**
- `id` (string): Watchlist ID

**Request Body:**
```typescript
{
  name?: string;
  description?: string;
  isPublic?: boolean;
}
```

**Response:**
```typescript
ApiResponse<Watchlist>
```

**Example:**
```bash
PUT /api/watchlists/watchlist-123
Content-Type: application/json

{
  "name": "Updated Tech Giants",
  "description": "Leading technology companies worldwide"
}
```

---

### 5. Delete Watchlist

**Endpoint:** `DELETE /api/watchlists/:id`

**Path Parameters:**
- `id` (string): Watchlist ID

**Response:**
```typescript
ApiResponse<{ id: string }>
```

**Example:**
```bash
DELETE /api/watchlists/watchlist-123
```

---

### 6. Add Stock to Watchlist

**Endpoint:** `POST /api/watchlists/:id/stocks`

**Path Parameters:**
- `id` (string): Watchlist ID

**Request Body:**
```typescript
{
  symbol: string;  // Stock ticker symbol
}
```

**Response:**
```typescript
ApiResponse<Watchlist>
```

**Example:**
```bash
POST /api/watchlists/watchlist-123/stocks
Content-Type: application/json

{
  "symbol": "NVDA"
}
```

---

### 7. Remove Stock from Watchlist

**Endpoint:** `DELETE /api/watchlists/:id/stocks/:symbol`

**Path Parameters:**
- `id` (string): Watchlist ID
- `symbol` (string): Stock ticker symbol

**Response:**
```typescript
ApiResponse<Watchlist>
```

**Example:**
```bash
DELETE /api/watchlists/watchlist-123/stocks/NVDA
```

---

### 8. Get Watchlist Performance

**Endpoint:** `GET /api/watchlists/:id/performance`

**Path Parameters:**
- `id` (string): Watchlist ID

**Query Parameters:**
```typescript
{
  period?: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '2Y';  // Default: '1D'
}
```

**Response:**
```typescript
ApiResponse<WatchlistPerformance>

interface WatchlistPerformance {
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
```

**Example:**
```bash
GET /api/watchlists/watchlist-123/performance?period=1M
```

---

## Screener/Filter APIs

### 1. Filter Stocks

**Endpoint:** `POST /api/screener/filter`

**Request Body:**
```typescript
{
  filters: AdvancedFilter;
  sort?: SortConfig;
  pagination?: {
    page: number;
    pageSize: number;
  };
}

interface AdvancedFilter {
  // Basic filters
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

  // Advanced filters
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

interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}
```

**Response:**
```typescript
ApiResponse<FilterResult>

interface FilterResult {
  stocks: Stock[];
  pagination: PaginationConfig;
  appliedFilters: AdvancedFilter;
  sort?: SortConfig;
}
```

**Example:**
```bash
POST /api/screener/filter
Content-Type: application/json

{
  "filters": {
    "sectors": ["Technology"],
    "minMarketCap": 1000000000,
    "minDividendYield": 1.5,
    "maxPE": 30
  },
  "sort": {
    "field": "marketCap",
    "direction": "desc"
  },
  "pagination": {
    "page": 1,
    "pageSize": 50
  }
}
```

---

### 2. Get Filter Presets

**Endpoint:** `GET /api/screener/presets`

**Response:**
```typescript
ApiResponse<FilterPreset[]>

interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: AdvancedFilter;
  isPublic: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Example:**
```bash
GET /api/screener/presets
```

---

### 3. Get Filter Preset by ID

**Endpoint:** `GET /api/screener/presets/:id`

**Path Parameters:**
- `id` (string): Preset ID

**Response:**
```typescript
ApiResponse<FilterPreset>
```

**Example:**
```bash
GET /api/screener/presets/high_dividend
```

---

### 4. Create Filter Preset

**Endpoint:** `POST /api/screener/presets`

**Request Body:**
```typescript
{
  name: string;
  description: string;
  filters: AdvancedFilter;
  isPublic?: boolean;  // Default: false
}
```

**Response:**
```typescript
ApiResponse<FilterPreset>
```

**Example:**
```bash
POST /api/screener/presets
Content-Type: application/json

{
  "name": "My Tech Growth",
  "description": "High-growth technology companies",
  "filters": {
    "sectors": ["Technology"],
    "minMarketCap": 10000000000,
    "minROE": 15
  },
  "isPublic": false
}
```

---

### 5. Delete Filter Preset

**Endpoint:** `DELETE /api/screener/presets/:id`

**Path Parameters:**
- `id` (string): Preset ID

**Response:**
```typescript
ApiResponse<{ id: string }>
```

**Example:**
```bash
DELETE /api/screener/presets/preset-123
```

---

## Events APIs

### 1. Get Events Calendar

**Endpoint:** `GET /api/events`

**Query Parameters:**
```typescript
{
  from: string;           // Start date (ISO 8601), required
  to: string;             // End date (ISO 8601), required
  types?: EventType[];    // Filter by event types
  symbols?: string[];     // Filter by stock symbols
}

type EventType = 'earnings' | 'dividend' | 'economics' | 'ipo' | 'split';
```

**Response:**
```typescript
ApiResponse<CalendarDay[]>

interface CalendarDay {
  date: string;
  events: Event[];
  eventCounts: Record<EventType, number>;
}

interface Event {
  id: string;
  type: EventType;
  symbol?: string;
  name: string;
  date: string;
  time?: string;
  description?: string;
  details?: Record<string, any>;
}
```

**Example:**
```bash
GET /api/events?from=2025-10-01&to=2025-10-31&types=earnings,dividend
```

---

### 2. Get Event by ID

**Endpoint:** `GET /api/events/:id`

**Path Parameters:**
- `id` (string): Event ID

**Response:**
```typescript
ApiResponse<Event>

// Event can be one of:
// - EarningsEvent
// - DividendEvent
// - EconomicEvent
// - IPOEvent
// - SplitEvent
```

**Example:**
```bash
GET /api/events/earnings-aapl-2025q3
```

---

### 3. Get Earnings Events

**Endpoint:** `GET /api/events/earnings`

**Query Parameters:**
```typescript
{
  from?: string;
  to?: string;
  symbols?: string[];
  page?: number;
  pageSize?: number;
}
```

**Response:**
```typescript
ApiResponse<PaginatedResponse<EarningsEvent>>

interface EarningsEvent extends Event {
  type: 'earnings';
  symbol: string;
  fiscalQuarter: string;
  fiscalYear: number;
  estimatedEPS?: number;
  actualEPS?: number;
  estimatedRevenue?: number;
  actualRevenue?: number;
}
```

**Example:**
```bash
GET /api/events/earnings?from=2025-10-01&to=2025-10-31&symbols=AAPL,MSFT
```

---

### 4. Get Dividend Events

**Endpoint:** `GET /api/events/dividends`

**Query Parameters:**
```typescript
{
  from?: string;
  to?: string;
  symbols?: string[];
  page?: number;
  pageSize?: number;
}
```

**Response:**
```typescript
ApiResponse<PaginatedResponse<DividendEvent>>

interface DividendEvent extends Event {
  type: 'dividend';
  symbol: string;
  amount: number;
  exDate: string;
  paymentDate: string;
  recordDate: string;
  frequency: 'monthly' | 'quarterly' | 'semi-annual' | 'annual';
}
```

**Example:**
```bash
GET /api/events/dividends?symbols=AAPL&from=2025-01-01
```

---

### 5. Get Economic Events

**Endpoint:** `GET /api/events/economics`

**Query Parameters:**
```typescript
{
  from?: string;
  to?: string;
  country?: string;
  impact?: 'low' | 'medium' | 'high';
  page?: number;
  pageSize?: number;
}
```

**Response:**
```typescript
ApiResponse<PaginatedResponse<EconomicEvent>>

interface EconomicEvent extends Event {
  type: 'economics';
  indicator: string;
  country: string;
  impact: 'low' | 'medium' | 'high';
  forecast?: number;
  actual?: number;
  previous?: number;
}
```

**Example:**
```bash
GET /api/events/economics?country=US&impact=high
```

---

## Market Data APIs

### 1. Get Market Indices

**Endpoint:** `GET /api/markets/indices`

**Response:**
```typescript
ApiResponse<MarketIndex[]>

interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}
```

**Example:**
```bash
GET /api/markets/indices
```

---

### 2. Get Market Status

**Endpoint:** `GET /api/markets/status`

**Response:**
```typescript
ApiResponse<MarketStatus>

interface MarketStatus {
  isOpen: boolean;
  exchange: string;
  currentTime: string;
  nextOpen?: string;
  nextClose?: string;
  timezone: string;
}
```

**Example:**
```bash
GET /api/markets/status
```

---

### 3. Get Market Hours

**Endpoint:** `GET /api/markets/hours`

**Query Parameters:**
```typescript
{
  exchange?: string;  // Default: 'NYSE'
  date?: string;      // ISO date, default: today
}
```

**Response:**
```typescript
ApiResponse<MarketHours>

interface MarketHours {
  exchange: string;
  date: string;
  isOpen: boolean;
  preMarket?: {
    start: string;
    end: string;
  };
  regular: {
    start: string;
    end: string;
  };
  postMarket?: {
    start: string;
    end: string;
  };
  timezone: string;
}
```

**Example:**
```bash
GET /api/markets/hours?exchange=NYSE&date=2025-10-22
```

---

### 4. Get Sector Performance

**Endpoint:** `GET /api/markets/sectors`

**Query Parameters:**
```typescript
{
  period?: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y';  // Default: '1D'
}
```

**Response:**
```typescript
ApiResponse<SectorPerformance[]>

interface SectorPerformance {
  name: string;
  change: number;
  changePercent: number;
  volume: number;
  topGainer?: {
    symbol: string;
    changePercent: number;
  };
  topLoser?: {
    symbol: string;
    changePercent: number;
  };
}
```

**Example:**
```bash
GET /api/markets/sectors?period=1D
```

---

### 5. Get Most Active Stocks

**Endpoint:** `GET /api/markets/movers/active`

**Query Parameters:**
```typescript
{
  limit?: number;  // Default: 20, Max: 100
}
```

**Response:**
```typescript
ApiResponse<Stock[]>
```

**Example:**
```bash
GET /api/markets/movers/active?limit=10
```

---

### 6. Get Top Gainers

**Endpoint:** `GET /api/markets/movers/gainers`

**Query Parameters:**
```typescript
{
  limit?: number;     // Default: 20, Max: 100
  minPrice?: number;  // Minimum stock price
}
```

**Response:**
```typescript
ApiResponse<Stock[]>
```

**Example:**
```bash
GET /api/markets/movers/gainers?limit=10&minPrice=5
```

---

### 7. Get Top Losers

**Endpoint:** `GET /api/markets/movers/losers`

**Query Parameters:**
```typescript
{
  limit?: number;     // Default: 20, Max: 100
  minPrice?: number;  // Minimum stock price
}
```

**Response:**
```typescript
ApiResponse<Stock[]>
```

**Example:**
```bash
GET /api/markets/movers/losers?limit=10
```

---

## WebSocket APIs

### Connection

**Endpoint:** `ws://localhost:3000/api/ws` or `wss://domain.com/api/ws`

**Connection Protocol:**
1. Client connects to WebSocket endpoint
2. Server sends connection acknowledgment
3. Client subscribes to channels
4. Server streams real-time updates

---

### Message Format

All WebSocket messages follow this format:

```typescript
interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}
```

---

### 1. Subscribe to Stock Updates

**Send:**
```json
{
  "type": "subscribe.stocks",
  "payload": {
    "symbols": ["AAPL", "MSFT", "GOOGL"]
  }
}
```

**Receive:**
```typescript
interface StockUpdateMessage {
  type: 'stock.update';
  payload: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    timestamp: string;
  };
  timestamp: string;
}
```

**Example Receive:**
```json
{
  "type": "stock.update",
  "payload": {
    "symbol": "AAPL",
    "price": 262.85,
    "change": 0.28,
    "changePercent": 0.11,
    "volume": 46750000,
    "timestamp": "2025-10-22T14:30:15Z"
  },
  "timestamp": "2025-10-22T14:30:15Z"
}
```

---

### 2. Unsubscribe from Stock Updates

**Send:**
```json
{
  "type": "unsubscribe.stocks",
  "payload": {
    "symbols": ["AAPL"]
  }
}
```

---

### 3. Subscribe to Watchlist Updates

**Send:**
```json
{
  "type": "subscribe.watchlist",
  "payload": {
    "watchlistId": "watchlist-123"
  }
}
```

**Receive:**
```json
{
  "type": "watchlist.update",
  "payload": {
    "watchlistId": "watchlist-123",
    "stocks": [
      {
        "symbol": "AAPL",
        "price": 262.85,
        "change": 0.28,
        "changePercent": 0.11
      }
    ]
  },
  "timestamp": "2025-10-22T14:30:15Z"
}
```

---

### 4. Subscribe to Market Status

**Send:**
```json
{
  "type": "subscribe.market",
  "payload": {}
}
```

**Receive:**
```typescript
interface MarketStatusMessage {
  type: 'market.status';
  payload: {
    isOpen: boolean;
    nextOpen?: string;
    nextClose?: string;
  };
  timestamp: string;
}
```

---

### 5. Event Reminders

**Send:**
```json
{
  "type": "subscribe.events",
  "payload": {
    "symbols": ["AAPL"],
    "types": ["earnings", "dividend"]
  }
}
```

**Receive:**
```typescript
interface EventReminderMessage {
  type: 'event.reminder';
  payload: {
    eventId: string;
    eventType: string;
    symbol?: string;
    message: string;
    minutesUntil: number;
  };
  timestamp: string;
}
```

**Example Receive:**
```json
{
  "type": "event.reminder",
  "payload": {
    "eventId": "earnings-aapl-2025q4",
    "eventType": "earnings",
    "symbol": "AAPL",
    "message": "Apple Inc. earnings call starts in 15 minutes",
    "minutesUntil": 15
  },
  "timestamp": "2025-10-22T15:45:00Z"
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate resource)
- `422` - Unprocessable Entity (business logic errors)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

### Error Response Format

```typescript
interface ApiError {
  error: string;           // Human-readable error message
  code: string;            // Machine-readable error code
  details?: Record<string, any>;  // Additional error details
  timestamp: string;       // ISO timestamp
}
```

**Example Error Response:**
```json
{
  "error": "Stock symbol not found",
  "code": "STOCK_NOT_FOUND",
  "details": {
    "symbol": "INVALID",
    "suggestion": "Did you mean AAPL?"
  },
  "timestamp": "2025-10-22T14:30:00Z"
}
```

---

### Common Error Codes

#### Stock Errors
- `STOCK_NOT_FOUND` - Stock symbol does not exist
- `INVALID_SYMBOL` - Invalid stock symbol format
- `STOCK_DATA_UNAVAILABLE` - Stock data temporarily unavailable

#### Watchlist Errors
- `WATCHLIST_NOT_FOUND` - Watchlist does not exist
- `WATCHLIST_LIMIT_REACHED` - Maximum number of watchlists reached
- `STOCK_ALREADY_IN_WATCHLIST` - Stock already exists in watchlist
- `WATCHLIST_NAME_EXISTS` - Watchlist name already used

#### Filter Errors
- `INVALID_FILTER_PARAMS` - Invalid filter parameters
- `PRESET_NOT_FOUND` - Filter preset not found

#### Event Errors
- `EVENT_NOT_FOUND` - Event does not exist
- `INVALID_DATE_RANGE` - Invalid date range specified

#### Rate Limiting
- `RATE_LIMIT_EXCEEDED` - Too many requests, try again later

---

### Validation Errors

For validation errors (HTTP 400), the response includes field-level details:

```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "fields": {
      "name": "Name is required and must be between 1-100 characters",
      "stocks": "Must be an array of valid stock symbols"
    }
  },
  "timestamp": "2025-10-22T14:30:00Z"
}
```

---

## Rate Limiting

### Limits

- **General API:** 100 requests per minute per IP
- **Stock History:** 30 requests per minute
- **Screener Filter:** 10 requests per minute
- **WebSocket Connections:** 5 concurrent connections per user

### Rate Limit Headers

All API responses include rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1729608000
```

When rate limited (HTTP 429):

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_EXCEEDED",
  "details": {
    "limit": 100,
    "resetAt": "2025-10-22T15:00:00Z"
  },
  "timestamp": "2025-10-22T14:30:00Z"
}
```

---

## Authentication (Future)

### JWT Bearer Token

All authenticated requests should include:

```
Authorization: Bearer <jwt_token>
```

### Endpoints Requiring Authentication

- All `POST`, `PUT`, `DELETE` operations
- Watchlist management
- Filter preset management
- Personal data access

---

## Pagination

### Standard Pagination

All paginated endpoints support:

```typescript
{
  page: number;        // 1-based page number
  pageSize: number;    // Items per page (default: 50, max: 200)
}
```

### Pagination Response

```typescript
{
  pagination: {
    page: 1,
    pageSize: 50,
    totalItems: 523,
    totalPages: 11,
    hasNext: true,
    hasPrevious: false
  }
}
```

---

## Sorting

### Standard Sort Parameters

```typescript
{
  sort: string;              // Field name to sort by
  direction: 'asc' | 'desc'; // Sort direction
}
```

### Example

```
GET /api/stocks?sort=marketCap&direction=desc
```

---

## Versioning

API version is included in the base URL:

- Current: `/api` (v1, default)
- Future: `/api/v2`, `/api/v3`, etc.

Version compatibility is maintained for at least 12 months after a new version is released.

---

## Data Freshness

### Real-time Data
- Stock prices: ~15-minute delay (or real-time with premium subscription)
- Market indices: ~15-minute delay
- WebSocket updates: Real-time during market hours

### Historical Data
- Price history: Daily updates after market close
- Financial statements: Updated within 24 hours of filing
- Company information: Updated weekly

### Event Data
- Earnings calendar: Updated daily
- Dividend calendar: Updated daily
- Economic calendar: Updated daily

---

## Support

For API support and questions:
- Documentation: https://docs.tickerfilter.com
- Email: api@tickerfilter.com
- GitHub Issues: https://github.com/tickerfilter/api/issues

---

**End of API Contract v1.0.0**
