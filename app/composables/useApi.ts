// API Client Composable
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { Stock, PricePoint, FinancialStatement, FundamentalAnalysis, NewsArticle } from '~/types/stock';
import type { Event } from '~/types/event';
import type { Watchlist } from '~/types/watchlist';
import type { FilterResult, AdvancedFilter } from '~/types/filter';
import type { ApiResponse, PaginatedResponse } from '~/types/api';

export const useApi = () => {
  const config = useRuntimeConfig();
  const mockData = useMockData();

  // API client configuration
  const baseURL = config.public.apiBase || '/api';
  const useMockMode = config.public.useMockData !== false; // Default to mock mode

  const client: AxiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for auth tokens
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  // Stock APIs
  const getStocks = async (filters?: AdvancedFilter, page = 1, pageSize = 50): Promise<FilterResult> => {
    if (useMockMode) {
      // Return mock data
      const stocks = Array.from({ length: pageSize }, () => mockData.generateStock());
      return {
        stocks,
        pagination: {
          page,
          pageSize,
          totalItems: 1000,
          totalPages: Math.ceil(1000 / pageSize),
        },
        appliedFilters: filters || {},
      };
    }

    const response = await client.get<FilterResult>('/stocks', {
      params: { ...filters, page, pageSize },
    });
    return response.data;
  };

  const getStock = async (symbol: string): Promise<Stock> => {
    if (useMockMode) {
      return mockData.generateStock({ symbol });
    }

    const response = await client.get<ApiResponse<Stock>>(`/stocks/${symbol}`);
    return response.data.data;
  };

  const getStockHistory = async (symbol: string, days = 365): Promise<PricePoint[]> => {
    if (useMockMode) {
      return mockData.generatePriceHistory(symbol, days);
    }

    const response = await client.get<ApiResponse<PricePoint[]>>(`/stocks/${symbol}/history`, {
      params: { days },
    });
    return response.data.data;
  };

  const getStockFinancials = async (symbol: string): Promise<FinancialStatement[]> => {
    if (useMockMode) {
      return mockData.generateFinancials(symbol);
    }

    const response = await client.get<ApiResponse<FinancialStatement[]>>(`/stocks/${symbol}/financials`);
    return response.data.data;
  };

  const getStockFundamentals = async (symbol: string): Promise<FundamentalAnalysis> => {
    if (useMockMode) {
      return mockData.generateFundamentals();
    }

    const response = await client.get<ApiResponse<FundamentalAnalysis>>(`/stocks/${symbol}/fundamentals`);
    return response.data.data;
  };

  const getStockNews = async (symbol: string, limit = 10): Promise<NewsArticle[]> => {
    if (useMockMode) {
      return mockData.generateNews(symbol, limit);
    }

    const response = await client.get<ApiResponse<NewsArticle[]>>(`/stocks/${symbol}/news`, {
      params: { limit },
    });
    return response.data.data;
  };

  // Watchlist APIs
  const getWatchlists = async (): Promise<Watchlist[]> => {
    if (useMockMode) {
      return mockData.generateWatchlists(3);
    }

    const response = await client.get<ApiResponse<Watchlist[]>>('/watchlists');
    return response.data.data;
  };

  const getWatchlist = async (id: string): Promise<Watchlist> => {
    if (useMockMode) {
      const watchlists = mockData.generateWatchlists(3);

      return watchlists.find(w => w.id === id) || watchlists[0];
    }

    const response = await client.get<ApiResponse<Watchlist>>(`/watchlists/${id}`);
    return response.data.data;
  };

  const createWatchlist = async (name: string, description?: string): Promise<Watchlist> => {
    if (useMockMode) {
      return {
        id: `watchlist-${Date.now()}`,
        name,
        description,
        stocks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const response = await client.post<ApiResponse<Watchlist>>('/watchlists', { name, description });
    return response.data.data;
  };

  const updateWatchlist = async (id: string, data: Partial<Watchlist>): Promise<Watchlist> => {
    if (useMockMode) {
      const watchlist = await getWatchlist(id);
      return {
        ...watchlist,
        ...data,
        updatedAt: new Date().toISOString(),
      };
    }

    const response = await client.put<ApiResponse<Watchlist>>(`/watchlists/${id}`, data);
    return response.data.data;
  };

  const deleteWatchlist = async (id: string): Promise<void> => {
    if (useMockMode) {
      return Promise.resolve();
    }

    await client.delete(`/watchlists/${id}`);
  };

  const addStockToWatchlist = async (watchlistId: string, symbol: string): Promise<Watchlist> => {
    if (useMockMode) {
      const watchlist = await getWatchlist(watchlistId);
      if (!watchlist.stocks.includes(symbol)) {
        watchlist.stocks.push(symbol);
      }
      return watchlist;
    }

    const response = await client.post<ApiResponse<Watchlist>>(
      `/watchlists/${watchlistId}/stocks`,
      { symbol }
    );
    return response.data.data;
  };

  const removeStockFromWatchlist = async (watchlistId: string, symbol: string): Promise<Watchlist> => {
    if (useMockMode) {
      const watchlist = await getWatchlist(watchlistId);
      watchlist.stocks = watchlist.stocks.filter(s => s !== symbol);
      return watchlist;
    }

    const response = await client.delete<ApiResponse<Watchlist>>(
      `/watchlists/${watchlistId}/stocks/${symbol}`
    );
    return response.data.data;
  };

  // Event APIs
  const getEvents = async (startDate?: string, endDate?: string, types?: string[]): Promise<Event[]> => {
    if (useMockMode) {
      const allEvents = mockData.generateEvents(30);
      return allEvents.filter(event => {
        const matchesType = !types || types.length === 0 || types.includes(event.type);
        const matchesDate = (!startDate || event.date >= startDate) && (!endDate || event.date <= endDate);
        return matchesType && matchesDate;
      });
    }

    const response = await client.get<ApiResponse<Event[]>>('/events', {
      params: { startDate, endDate, types: types?.join(',') },
    });
    return response.data.data;
  };

  const getEvent = async (id: string): Promise<Event> => {
    if (useMockMode) {
      const events = mockData.generateEvents(30);
      const event = events.find(e => e.id === id);

      return events.find(e => e.id === id) || events[0];
    }

    const response = await client.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data.data;
  };

  // Market data
  const getMarketIndices = async () => {
    if (useMockMode) {
      return mockData.generateMarketIndices();
    }

    const response = await client.get<ApiResponse<any>>('/market/indices');
    return response.data.data;
  };

  return {
    // Stock methods
    getStocks,
    getStock,
    getStockHistory,
    getStockFinancials,
    getStockFundamentals,
    getStockNews,

    // Watchlist methods
    getWatchlists,
    getWatchlist,
    createWatchlist,
    updateWatchlist,
    deleteWatchlist,
    addStockToWatchlist,
    removeStockFromWatchlist,

    // Event methods
    getEvents,
    getEvent,

    // Market methods
    getMarketIndices,

    // Utilities
    client,
    useMockMode,
  };
};
