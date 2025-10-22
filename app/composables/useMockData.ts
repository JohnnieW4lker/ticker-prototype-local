// Mock Data Generator
import type { Stock, PricePoint, FinancialStatement, FundamentalAnalysis, NewsArticle, MarketIndex } from '~/types/stock';
import type { Event } from '~/types/event';
import type { Watchlist } from '~/types/watchlist';

// Sample stock symbols and companies
const MOCK_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics', ceo: 'Timothy Cook' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software', ceo: 'Satya Nadella' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors', ceo: 'Jensen Huang' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Services', ceo: 'Sundar Pichai' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical', industry: 'E-commerce', ceo: 'Andy Jassy' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical', industry: 'Automotive', ceo: 'Elon Musk' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media', ceo: 'Mark Zuckerberg' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial', industry: 'Banking', ceo: 'Jamie Dimon' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals', ceo: 'Joaquin Duato' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial', industry: 'Payment Processing', ceo: 'Ryan McInerney' },
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive', industry: 'Retail', ceo: 'Doug McMillon' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Defensive', industry: 'Consumer Goods', ceo: 'Jon Moeller' },
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', industry: 'Oil & Gas', ceo: 'Darren Woods' },
  { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial', industry: 'Banking', ceo: 'Brian Moynihan' },
  { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', industry: 'Entertainment', ceo: 'Bob Iger' },
  { symbol: 'CSCO', name: 'Cisco Systems Inc.', sector: 'Technology', industry: 'Networking', ceo: 'Chuck Robbins' },
  { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Defensive', industry: 'Beverages', ceo: 'James Quincey' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', industry: 'Streaming', ceo: 'Ted Sarandos' },
  { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors', ceo: 'Pat Gelsinger' },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Pharmaceuticals', ceo: 'Albert Bourla' },
];

export const useMockData = () => {
  // Generate random number within range
  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  // Generate random integer within range
  const randomInt = (min: number, max: number) => Math.floor(random(min, max));

  // Generate random stock data
  const generateStock = (template?: Partial<Stock>): Stock => {
    const baseStock = template?.symbol
      ? MOCK_STOCKS.find(s => s.symbol === template.symbol) || MOCK_STOCKS[0]
      : MOCK_STOCKS[randomInt(0, MOCK_STOCKS.length)];

    const price = template?.price || random(50, 500);
    const change = random(-10, 10);
    const changePercent = (change / price) * 100;

    return {
      symbol: baseStock.symbol,
      name: baseStock.name,
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume: randomInt(1000000, 50000000),
      marketCap: random(100000000000, 3000000000000),
      pe: Math.random() > 0.1 ? Number(random(10, 35).toFixed(2)) : null,
      eps: Math.random() > 0.1 ? Number(random(1, 20).toFixed(2)) : null,
      dividendYield: Math.random() > 0.3 ? Number(random(0.5, 5).toFixed(2)) : null,
      dividendRate: Math.random() > 0.3 ? Number(random(0.5, 10).toFixed(2)) : null,
      exDividendDate: Math.random() > 0.5 ? new Date(Date.now() + randomInt(-30, 30) * 86400000).toISOString().split('T')[0] : null,
      nextEarningsDate: new Date(Date.now() + randomInt(1, 90) * 86400000).toISOString().split('T')[0],
      fiftyTwoWeekHigh: Number((price * random(1.1, 1.5)).toFixed(2)),
      fiftyTwoWeekLow: Number((price * random(0.5, 0.9)).toFixed(2)),
      industry: baseStock.industry,
      sector: baseStock.sector,
      employees: randomInt(10000, 200000),
      ceo: baseStock.ceo,
      website: `https://www.${baseStock.symbol.toLowerCase()}.com`,
      ...template,
    };
  };

  // Generate price history
  const generatePriceHistory = (symbol: string, days: number = 365): PricePoint[] => {
    const history: PricePoint[] = [];
    let basePrice = random(100, 300);

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayChange = random(-5, 5);
      basePrice = Math.max(basePrice + dayChange, 10);

      const open = basePrice + random(-2, 2);
      const close = basePrice + random(-2, 2);
      const high = Math.max(open, close) + random(0, 3);
      const low = Math.min(open, close) - random(0, 3);

      history.push({
        date: date.toISOString().split('T')[0],
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume: randomInt(1000000, 50000000),
      });
    }

    return history;
  };

  // Generate financial statements
  const generateFinancials = (symbol: string, periods: number = 8): FinancialStatement[] => {
    const financials: FinancialStatement[] = [];
    const baseRevenue = random(50000000000, 200000000000);

    for (let i = 0; i < periods; i++) {
      const quarter = 4 - (i % 4);
      const year = new Date().getFullYear() - Math.floor(i / 4);
      const revenue = baseRevenue * (1 + random(-0.1, 0.15));
      const grossProfit = revenue * random(0.3, 0.6);
      const operatingExpense = grossProfit * random(0.3, 0.5);
      const operatingIncome = grossProfit - operatingExpense;
      const netIncome = operatingIncome * random(0.7, 0.9);

      financials.push({
        period: `Q${quarter} ${year}`,
        reportDate: `${year}-${(quarter * 3).toString().padStart(2, '0')}-30`,
        revenue: Number(revenue.toFixed(0)),
        costOfRevenue: Number((revenue - grossProfit).toFixed(0)),
        grossProfit: Number(grossProfit.toFixed(0)),
        operatingExpense: Number(operatingExpense.toFixed(0)),
        operatingIncome: Number(operatingIncome.toFixed(0)),
        netIncome: Number(netIncome.toFixed(0)),
        eps: Number((netIncome / 1000000000).toFixed(2)),
        ebitda: Number((operatingIncome * 1.2).toFixed(0)),
      });
    }

    return financials.reverse();
  };

  // Generate fundamental analysis
  const generateFundamentals = (): FundamentalAnalysis => {
    return {
      overallScore: randomInt(40, 95),
      profitabilityScore: randomInt(50, 100),
      debtScore: randomInt(30, 80),
      liquidityScore: randomInt(20, 90),
      performanceScore: randomInt(40, 90),
      roe: Number(random(10, 40).toFixed(2)),
      roa: Number(random(5, 25).toFixed(2)),
      ros: Number(random(10, 30).toFixed(2)),
      debtToEquity: Number(random(0.3, 2.5).toFixed(2)),
      currentRatio: Number(random(0.8, 3.0).toFixed(2)),
      quickRatio: Number(random(0.5, 2.5).toFixed(2)),
    };
  };

  // Generate news articles
  const generateNews = (symbol: string, count: number = 10): NewsArticle[] => {
    const headlines = [
      `${symbol} Reports Strong Quarterly Earnings`,
      `Analysts Upgrade ${symbol} Stock Rating`,
      `${symbol} Announces New Product Launch`,
      `${symbol} CEO Discusses Future Strategy`,
      `${symbol} Stock Hits New High`,
      `Market Watch: ${symbol} Performance Analysis`,
      `${symbol} Beats Revenue Expectations`,
      `Industry Trends Impact ${symbol} Outlook`,
      `${symbol} Expands Market Presence`,
      `${symbol} Announces Strategic Partnership`,
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: `news-${symbol}-${i}`,
      title: headlines[i % headlines.length],
      summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Market analysis shows ${symbol} continuing strong performance in its sector.`,
      url: `https://example.com/news/${symbol.toLowerCase()}-${i}`,
      source: ['Bloomberg', 'Reuters', 'CNBC', 'Wall Street Journal'][randomInt(0, 4)],
      publishedAt: new Date(Date.now() - i * 3600000).toISOString(),
      sentiment: ['positive', 'negative', 'neutral'][randomInt(0, 3)] as 'positive' | 'negative' | 'neutral',
    }));
  };

  // Generate market indices
  const generateMarketIndices = (): MarketIndex[] => {
    return [
      {
        symbol: '^GSPC',
        name: 'S&P 500',
        value: random(4500, 5000),
        change: random(-50, 50),
        changePercent: random(-1, 1),
      },
      {
        symbol: '^DJI',
        name: 'Dow Jones',
        value: random(35000, 38000),
        change: random(-300, 300),
        changePercent: random(-1, 1),
      },
      {
        symbol: '^IXIC',
        name: 'NASDAQ',
        value: random(14000, 16000),
        change: random(-100, 100),
        changePercent: random(-1, 1),
      },
    ].map(index => ({
      ...index,
      value: Number(index.value.toFixed(2)),
      change: Number(index.change.toFixed(2)),
      changePercent: Number(index.changePercent.toFixed(2)),
    }));
  };

  // Generate events
  const generateEvents = (days: number = 30): Event[] => {
    const events: Event[] = [];
    const eventTypes = ['earnings', 'dividend', 'economics', 'ipo', 'split'] as const;

    // Economic indicators
    const economicIndicators = [
      { name: 'GDP Growth Rate', impact: 'high' },
      { name: 'Unemployment Rate', impact: 'high' },
      { name: 'CPI (Inflation)', impact: 'high' },
      { name: 'Federal Funds Rate', impact: 'high' },
      { name: 'Retail Sales', impact: 'medium' },
      { name: 'Consumer Confidence Index', impact: 'medium' },
      { name: 'Manufacturing PMI', impact: 'medium' },
      { name: 'Housing Starts', impact: 'low' },
      { name: 'Trade Balance', impact: 'low' },
      { name: 'Initial Jobless Claims', impact: 'medium' },
    ];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Vary number of events: more during weekdays, fewer on weekends
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const numEvents = isWeekend ? randomInt(1, 3) : randomInt(3, 8);

      for (let j = 0; j < numEvents; j++) {
        // Weight event types: earnings most common, splits least common
        const typeWeights = [40, 25, 20, 10, 5]; // earnings, dividend, economics, ipo, split
        const randomWeight = randomInt(0, 100);
        let cumulativeWeight = 0;
        let selectedType = 0;

        for (let k = 0; k < typeWeights.length; k++) {
          cumulativeWeight += typeWeights[k];
          if (randomWeight < cumulativeWeight) {
            selectedType = k;
            break;
          }
        }

        const type = eventTypes[selectedType];
        const stock = MOCK_STOCKS[randomInt(0, MOCK_STOCKS.length)];

        let eventData: Event = {
          id: `event-${dateStr}-${j}`,
          type,
          date: dateStr,
        } as Event;

        // Generate type-specific data
        switch (type) {
          case 'earnings':
            eventData = {
              ...eventData,
              symbol: stock.symbol,
              name: `${stock.name} Q${Math.floor(randomInt(1, 5))} ${date.getFullYear()} Earnings Report`,
              time: randomInt(7, 9) === 7 ? '07:00' : '16:00', // Before or after market
              description: `${stock.name} is expected to release quarterly earnings. Analysts estimate EPS of $${random(1, 10).toFixed(2)}.`,
            };
            break;

          case 'dividend':
            eventData = {
              ...eventData,
              symbol: stock.symbol,
              name: `${stock.name} Dividend Payment`,
              time: '09:00',
              description: `Ex-dividend date for ${stock.name}. Shareholders of record will receive $${random(0.25, 2.5).toFixed(2)} per share.`,
            };
            break;

          case 'economics':
            const indicator = economicIndicators[randomInt(0, economicIndicators.length)];
            eventData = {
              ...eventData,
              name: `${indicator.name} Release`,
              time: `${randomInt(8, 11)}:30`,
              description: `U.S. ${indicator.name} data will be released. Previous: ${random(0, 5).toFixed(1)}%, Forecast: ${random(0, 5).toFixed(1)}%.`,
            };
            break;

          case 'ipo':
            eventData = {
              ...eventData,
              symbol: stock.symbol,
              name: `${stock.name} IPO`,
              time: '09:30',
              description: `${stock.name} begins trading on NASDAQ. IPO price range: $${randomInt(15, 25)}-$${randomInt(26, 40)} per share.`,
            };
            break;

          case 'split':
            const splitRatios = ['2:1', '3:1', '4:1', '3:2', '5:1'];
            const ratio = splitRatios[randomInt(0, splitRatios.length)];
            eventData = {
              ...eventData,
              symbol: stock.symbol,
              name: `${stock.name} Stock Split (${ratio})`,
              time: '09:30',
              description: `${stock.name} executes ${ratio} stock split. Each share will be divided into ${ratio.split(':')[0]} shares.`,
            };
            break;
        }

        events.push(eventData);
      }
    }

    return events.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return (a.time || '').localeCompare(b.time || '');
    });
  };

  // Generate watchlists
  const generateWatchlists = (count: number = 3): Watchlist[] => {
    const watchlists: Watchlist[] = [];

    const names = [
      'S&P 500 Top 10',
      'Tech Leaders',
      'Dividend Champions',
      'Growth Stocks',
      'Value Picks',
    ];

    for (let i = 0; i < count; i++) {
      const numStocks = randomInt(5, 15);
      const stocks = Array.from({ length: numStocks }, () =>
        MOCK_STOCKS[randomInt(0, MOCK_STOCKS.length)].symbol
      ).filter((value, index, self) => self.indexOf(value) === index);

      watchlists.push({
        id: `watchlist-${i}`,
        name: names[i % names.length],
        description: `Mock watchlist with ${stocks.length} stocks`,
        stocks,
        createdAt: new Date(Date.now() - randomInt(1, 365) * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: Math.random() > 0.5,
        shareUrl: `https://tickerfilter.com/watchlist/${i}`,
      });
    }

    return watchlists;
  };

  return {
    generateStock,
    generatePriceHistory,
    generateFinancials,
    generateFundamentals,
    generateNews,
    generateMarketIndices,
    generateEvents,
    generateWatchlists,
    MOCK_STOCKS,
  };
};
