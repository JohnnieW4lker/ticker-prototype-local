export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  marketCap: number;
  peRatio: number | null;
  eps: number | null;
  dividendYield: number | null;
  exDividendDate: string | null;
  performance: {
    '1d': number;
    '5d': number;
    '1m': number;
    '3m': number;
    '6m': number;
    '1y': number;
    '2y': number;
  };
  volume: number;
  hasNote: boolean;
  nextEarningsDate?: string | null;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
  createdAt: string;
  updatedAt: string;
}

// Global state
const watchlists = ref<Watchlist[]>([]);
const activeWatchlistId = ref<string>('');

export const useWatchlists = () => {
  // Initialize with sample data if empty
  const initialize = () => {
    if (watchlists.value.length === 0) {
      // Create default S&P 500 Top 10 watchlist with sample data
      const sp500Top10: Watchlist = {
        id: 'sp500-top-10',
        name: 'S&P 500 Top 10',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        stocks: [
          {
            ticker: 'AAPL',
            name: 'Apple Inc.',
            price: 262.77,
            change: 0.202,
            marketCap: 3006000000000,
            peRatio: 37.24,
            eps: 7.05,
            dividendYield: 0.46,
            exDividendDate: '2025-11-15',
            performance: {
              '1d': 0.202,
              '5d': 4.15,
              '1m': 2.61,
              '3m': 22.56,
              '6m': 18.32,
              '1y': 11.41,
              '2y': 45.23
            },
            volume: 46588431,
            hasNote: false,
            nextEarningsDate: '2025-11-01'
          },
          {
            ticker: 'MSFT',
            name: 'Microsoft Corporation',
            price: 517.66,
            change: 1.45,
            marketCap: 3850000000000,
            peRatio: 35.87,
            eps: 14.43,
            dividendYield: 0.72,
            exDividendDate: '2025-11-20',
            performance: {
              '1d': 1.45,
              '5d': 3.25,
              '1m': 5.12,
              '3m': 18.42,
              '6m': 22.15,
              '1y': 28.56,
              '2y': 52.34
            },
            volume: 23457892,
            hasNote: true,
            nextEarningsDate: '2025-10-28'
          },
          {
            ticker: 'NVDA',
            name: 'NVIDIA Corporation',
            price: 181.16,
            change: -0.85,
            marketCap: 4450000000000,
            peRatio: 68.42,
            eps: 2.65,
            dividendYield: 0.03,
            exDividendDate: '2025-12-01',
            performance: {
              '1d': -0.85,
              '5d': 2.15,
              '1m': 8.45,
              '3m': 35.67,
              '6m': 45.23,
              '1y': 195.34,
              '2y': 412.56
            },
            volume: 178945623,
            hasNote: false,
            nextEarningsDate: '2025-11-15'
          },
          {
            ticker: 'GOOGL',
            name: 'Alphabet Inc.',
            price: 192.45,
            change: 0.78,
            marketCap: 2420000000000,
            peRatio: 28.56,
            eps: 6.73,
            dividendYield: null,
            exDividendDate: null,
            performance: {
              '1d': 0.78,
              '5d': 1.92,
              '1m': 4.56,
              '3m': 12.34,
              '6m': 15.67,
              '1y': 32.45,
              '2y': 58.23
            },
            volume: 45678923,
            hasNote: false,
            nextEarningsDate: '2025-10-30'
          },
          {
            ticker: 'AMZN',
            name: 'Amazon.com Inc.',
            price: 225.89,
            change: 1.23,
            marketCap: 2350000000000,
            peRatio: 42.13,
            eps: 5.36,
            dividendYield: null,
            exDividendDate: null,
            performance: {
              '1d': 1.23,
              '5d': 3.45,
              '1m': 6.78,
              '3m': 19.23,
              '6m': 28.45,
              '1y': 42.67,
              '2y': 68.92
            },
            volume: 56789234,
            hasNote: false,
            nextEarningsDate: '2025-11-02'
          },
          {
            ticker: 'TSLA',
            name: 'Tesla, Inc.',
            price: 368.42,
            change: -2.15,
            marketCap: 1170000000000,
            peRatio: 95.34,
            eps: 3.86,
            dividendYield: null,
            exDividendDate: null,
            performance: {
              '1d': -2.15,
              '5d': -1.45,
              '1m': 12.34,
              '3m': 45.67,
              '6m': 38.92,
              '1y': 156.78,
              '2y': 245.34
            },
            volume: 123456789,
            hasNote: true,
            nextEarningsDate: '2025-10-25'
          },
          {
            ticker: 'META',
            name: 'Meta Platforms Inc.',
            price: 648.92,
            change: 2.34,
            marketCap: 1650000000000,
            peRatio: 29.45,
            eps: 22.03,
            dividendYield: 0.32,
            exDividendDate: '2025-12-15',
            performance: {
              '1d': 2.34,
              '5d': 5.67,
              '1m': 8.92,
              '3m': 25.34,
              '6m': 42.67,
              '1y': 78.92,
              '2y': 145.23
            },
            volume: 34567892,
            hasNote: false,
            nextEarningsDate: '2025-11-05'
          },
          {
            ticker: 'BRK.B',
            name: 'Berkshire Hathaway Inc.',
            price: 478.23,
            change: 0.45,
            marketCap: 1100000000000,
            peRatio: 22.34,
            eps: 21.39,
            dividendYield: null,
            exDividendDate: null,
            performance: {
              '1d': 0.45,
              '5d': 1.23,
              '1m': 2.45,
              '3m': 8.67,
              '6m': 12.34,
              '1y': 18.92,
              '2y': 34.56
            },
            volume: 2345678,
            hasNote: false,
            nextEarningsDate: null
          },
          {
            ticker: 'LLY',
            name: 'Eli Lilly and Company',
            price: 923.45,
            change: 3.12,
            marketCap: 875000000000,
            peRatio: 89.23,
            eps: 10.35,
            dividendYield: 0.65,
            exDividendDate: '2025-11-10',
            performance: {
              '1d': 3.12,
              '5d': 6.45,
              '1m': 15.67,
              '3m': 42.34,
              '6m': 68.92,
              '1y': 125.67,
              '2y': 234.56
            },
            volume: 4567892,
            hasNote: false,
            nextEarningsDate: '2025-11-08'
          },
          {
            ticker: 'V',
            name: 'Visa Inc.',
            price: 324.67,
            change: 0.89,
            marketCap: 690000000000,
            peRatio: 32.45,
            eps: 10.01,
            dividendYield: 0.72,
            exDividendDate: '2025-11-18',
            performance: {
              '1d': 0.89,
              '5d': 2.34,
              '1m': 4.56,
              '3m': 12.78,
              '6m': 18.92,
              '1y': 26.45,
              '2y': 45.67
            },
            volume: 8901234,
            hasNote: false,
            nextEarningsDate: '2025-10-29'
          }
        ]
      };

      watchlists.value = [sp500Top10];
      activeWatchlistId.value = sp500Top10.id;
    }
  };

  // Set active watchlist
  const setActiveWatchlist = (id: string) => {
    activeWatchlistId.value = id;
  };

  // Add new watchlist
  const addWatchlist = (name: string) => {
    const newWatchlist: Watchlist = {
      id: `watchlist-${Date.now()}`,
      name,
      stocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    watchlists.value.push(newWatchlist);
    activeWatchlistId.value = newWatchlist.id;
  };

  // Remove watchlist
  const removeWatchlist = (id: string) => {
    const index = watchlists.value.findIndex(w => w.id === id);
    if (index !== -1) {
      watchlists.value.splice(index, 1);
      if (activeWatchlistId.value === id && watchlists.value.length > 0) {
        activeWatchlistId.value = watchlists.value[0].id;
      }
    }
  };

  // Add stock to watchlist
  const addStockToWatchlist = (watchlistId: string, stock: Stock) => {
    const watchlist = watchlists.value.find(w => w.id === watchlistId);
    if (watchlist) {
      // Check if stock already exists
      const exists = watchlist.stocks.some(s => s.ticker === stock.ticker);
      if (!exists) {
        watchlist.stocks.push(stock);
        watchlist.updatedAt = new Date().toISOString();
      }
    }
  };

  // Remove stock from watchlist
  const removeStockFromWatchlist = (watchlistId: string, ticker: string) => {
    const watchlist = watchlists.value.find(w => w.id === watchlistId);
    if (watchlist) {
      const index = watchlist.stocks.findIndex(s => s.ticker === ticker);
      if (index !== -1) {
        watchlist.stocks.splice(index, 1);
        watchlist.updatedAt = new Date().toISOString();
      }
    }
  };

  // Initialize on first use
  if (process.client) {
    initialize();
  }

  return {
    watchlists,
    activeWatchlistId,
    setActiveWatchlist,
    addWatchlist,
    removeWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist
  };
};
