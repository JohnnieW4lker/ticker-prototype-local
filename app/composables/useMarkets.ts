export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
}

export interface Sector {
  name: string;
  changePercent: number;
}

export interface MarketStock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

export interface MarketBreadth {
  advancing: number;
  declining: number;
  unchanged: number;
  advanceDeclineRatio: number;
  newHighs: number;
  newLows: number;
  upVolume: number;
  downVolume: number;
  sentiment: string;
}

export interface MarketData {
  indices: MarketIndex[];
  sectors: Sector[];
  gainers: MarketStock[];
  losers: MarketStock[];
  mostActive: MarketStock[];
  breadth: MarketBreadth;
}

export interface MarketStatus {
  isOpen: boolean;
  nextOpen?: string;
  nextClose?: string;
}

// Global state
const marketData = ref<MarketData>({
  indices: [],
  sectors: [],
  gainers: [],
  losers: [],
  mostActive: [],
  breadth: {
    advancing: 0,
    declining: 0,
    unchanged: 0,
    advanceDeclineRatio: 0,
    newHighs: 0,
    newLows: 0,
    upVolume: 0,
    downVolume: 0,
    sentiment: 'Neutral'
  }
});

const marketStatus = ref<MarketStatus>({
  isOpen: false
});

export const useMarkets = () => {
  // Helper to generate random variation
  const randomVariation = (base: number, range: number): number => {
    return base + (Math.random() - 0.5) * range;
  };

  // Generate sample data
  const generateSampleData = (): MarketData => {
    // Simulate different market conditions
    const marketConditions = ['bullish', 'bearish', 'volatile', 'neutral'];
    const currentCondition = marketConditions[Math.floor(Math.random() * marketConditions.length)];

    // Adjust base trends based on market condition
    let indexTrend = 0;
    let volatilityLevel = 14;
    let sentimentLabel = 'Neutral';

    switch (currentCondition) {
      case 'bullish':
        indexTrend = 0.8;
        volatilityLevel = 12;
        sentimentLabel = 'Bullish';
        break;
      case 'bearish':
        indexTrend = -0.7;
        volatilityLevel = 18;
        sentimentLabel = 'Bearish';
        break;
      case 'volatile':
        indexTrend = 0.2;
        volatilityLevel = 22;
        sentimentLabel = 'Neutral';
        break;
      default:
        indexTrend = 0.3;
        volatilityLevel = 14;
        sentimentLabel = 'Neutral';
    }

    return {
      indices: [
        {
          symbol: 'SPX',
          name: 'S&P 500',
          price: randomVariation(5845, 50),
          change: randomVariation(indexTrend * 40, 30),
          changePercent: randomVariation(indexTrend, 0.4),
          high: randomVariation(5862, 20),
          low: randomVariation(5823, 20)
        },
        {
          symbol: 'DJI',
          name: 'Dow Jones Industrial Average',
          price: randomVariation(42876, 300),
          change: randomVariation(indexTrend * 250, 150),
          changePercent: randomVariation(indexTrend * 0.9, 0.3),
          high: randomVariation(42950, 100),
          low: randomVariation(42745, 100)
        },
        {
          symbol: 'IXIC',
          name: 'NASDAQ Composite',
          price: randomVariation(18456, 150),
          change: randomVariation(indexTrend * 80, 60),
          changePercent: randomVariation(indexTrend * 1.2, 0.5),
          high: randomVariation(18565, 80),
          low: randomVariation(18398, 80)
        },
        {
          symbol: 'RUT',
          name: 'Russell 2000',
          price: randomVariation(2234, 30),
          change: randomVariation(indexTrend * 15, 12),
          changePercent: randomVariation(indexTrend * 0.8, 0.4),
          high: randomVariation(2245, 15),
          low: randomVariation(2221, 15)
        },
        {
          symbol: 'VIX',
          name: 'CBOE Volatility Index',
          price: volatilityLevel,
          change: randomVariation(-indexTrend * 0.5, 1),
          changePercent: randomVariation(-indexTrend * 3, 2),
          high: volatilityLevel + Math.abs(randomVariation(1, 2)),
          low: volatilityLevel - Math.abs(randomVariation(1, 1))
        },
        {
          symbol: 'NYA',
          name: 'NYSE Composite',
          price: randomVariation(19234, 100),
          change: randomVariation(indexTrend * 90, 50),
          changePercent: randomVariation(indexTrend * 0.95, 0.35),
          high: randomVariation(19267, 60),
          low: randomVariation(19178, 60)
        },
        {
          symbol: 'DXY',
          name: 'US Dollar Index',
          price: randomVariation(106.25, 0.5),
          change: randomVariation(-indexTrend * 0.3, 0.4),
          changePercent: randomVariation(-indexTrend * 0.3, 0.2),
          high: randomVariation(106.45, 0.3),
          low: randomVariation(106.05, 0.3)
        },
        {
          symbol: 'SOX',
          name: 'PHLX Semiconductor Index',
          price: randomVariation(5234, 80),
          change: randomVariation(indexTrend * 70, 50),
          changePercent: randomVariation(indexTrend * 1.5, 0.6),
          high: randomVariation(5345, 50),
          low: randomVariation(5198, 50)
        }
      ],
      sectors: [
        { name: 'Technology', changePercent: randomVariation(indexTrend * 1.5, 1.2) },
        { name: 'Financials', changePercent: randomVariation(indexTrend * 0.9, 0.8) },
        { name: 'Healthcare', changePercent: randomVariation(indexTrend * 0.6, 0.7) },
        { name: 'Consumer Discretionary', changePercent: randomVariation(indexTrend * 1.2, 1.0) },
        { name: 'Communication Services', changePercent: randomVariation(indexTrend * 0.8, 0.9) },
        { name: 'Industrials', changePercent: randomVariation(indexTrend * 0.7, 0.8) },
        { name: 'Consumer Staples', changePercent: randomVariation(indexTrend * 0.3, 0.5) },
        { name: 'Energy', changePercent: randomVariation(-indexTrend * 0.5, 1.5) },
        { name: 'Utilities', changePercent: randomVariation(indexTrend * 0.4, 0.6) },
        { name: 'Real Estate', changePercent: randomVariation(indexTrend * 0.5, 0.7) },
        { name: 'Materials', changePercent: randomVariation(indexTrend * 0.6, 0.9) }
      ],
      gainers: [
        { ticker: 'NVDA', name: 'NVIDIA Corporation', price: randomVariation(181, 10), change: randomVariation(9, 3), changePercent: randomVariation(5.5, 2) },
        { ticker: 'TSLA', name: 'Tesla, Inc.', price: randomVariation(375, 20), change: randomVariation(18, 5), changePercent: randomVariation(5.0, 1.5) },
        { ticker: 'AMD', name: 'Advanced Micro Devices', price: randomVariation(142, 8), change: randomVariation(7, 2), changePercent: randomVariation(4.8, 1.3) },
        { ticker: 'META', name: 'Meta Platforms Inc.', price: randomVariation(655, 30), change: randomVariation(30, 8), changePercent: randomVariation(4.7, 1.2) },
        { ticker: 'NFLX', name: 'Netflix Inc.', price: randomVariation(687, 35), change: randomVariation(31, 8), changePercent: randomVariation(4.6, 1.1) },
        { ticker: 'AVGO', name: 'Broadcom Inc.', price: randomVariation(178, 10), change: randomVariation(8, 2), changePercent: randomVariation(4.5, 1.0) },
        { ticker: 'CRM', name: 'Salesforce Inc.', price: randomVariation(315, 15), change: randomVariation(13, 4), changePercent: randomVariation(4.3, 1.0) },
        { ticker: 'NOW', name: 'ServiceNow Inc.', price: randomVariation(892, 40), change: randomVariation(37, 10), changePercent: randomVariation(4.2, 0.9) },
        { ticker: 'PANW', name: 'Palo Alto Networks', price: randomVariation(367, 18), change: randomVariation(15, 4), changePercent: randomVariation(4.1, 0.8) },
        { ticker: 'PLTR', name: 'Palantir Technologies', price: randomVariation(44, 3), change: randomVariation(1.8, 0.5), changePercent: randomVariation(4.0, 0.8) },
        { ticker: 'CRWD', name: 'CrowdStrike Holdings', price: randomVariation(312, 15), change: randomVariation(12, 3), changePercent: randomVariation(3.9, 0.7) },
        { ticker: 'SMCI', name: 'Super Micro Computer', price: randomVariation(45, 3), change: randomVariation(1.7, 0.4), changePercent: randomVariation(3.8, 0.7) },
        { ticker: 'ARM', name: 'Arm Holdings plc', price: randomVariation(145, 8), change: randomVariation(5.3, 1.5), changePercent: randomVariation(3.7, 0.6) },
        { ticker: 'AMAT', name: 'Applied Materials', price: randomVariation(208, 10), change: randomVariation(7.5, 2), changePercent: randomVariation(3.6, 0.6) },
        { ticker: 'LRCX', name: 'Lam Research Corp', price: randomVariation(95, 5), change: randomVariation(3.3, 1), changePercent: randomVariation(3.5, 0.5) }
      ],
      losers: [
        { ticker: 'INTC', name: 'Intel Corporation', price: randomVariation(23, 2), change: randomVariation(-1.5, 0.5), changePercent: randomVariation(-6.2, 1.5) },
        { ticker: 'BA', name: 'Boeing Company', price: randomVariation(178, 10), change: randomVariation(-10, 3), changePercent: randomVariation(-5.5, 1.2) },
        { ticker: 'DIS', name: 'Walt Disney Company', price: randomVariation(89, 5), change: randomVariation(-4.5, 1.5), changePercent: randomVariation(-5.0, 1.0) },
        { ticker: 'XOM', name: 'Exxon Mobil Corporation', price: randomVariation(112, 6), change: randomVariation(-5, 1.5), changePercent: randomVariation(-4.5, 0.8) },
        { ticker: 'CVX', name: 'Chevron Corporation', price: randomVariation(156, 8), change: randomVariation(-7, 2), changePercent: randomVariation(-4.3, 0.7) },
        { ticker: 'WBA', name: 'Walgreens Boots Alliance', price: randomVariation(12, 1), change: randomVariation(-0.5, 0.2), changePercent: randomVariation(-4.1, 0.6) },
        { ticker: 'PFE', name: 'Pfizer Inc.', price: randomVariation(28, 2), change: randomVariation(-1.1, 0.3), changePercent: randomVariation(-3.9, 0.5) },
        { ticker: 'CVS', name: 'CVS Health Corporation', price: randomVariation(58, 3), change: randomVariation(-2.2, 0.6), changePercent: randomVariation(-3.7, 0.5) },
        { ticker: 'SLB', name: 'Schlumberger NV', price: randomVariation(45, 3), change: randomVariation(-1.6, 0.4), changePercent: randomVariation(-3.5, 0.4) },
        { ticker: 'HAL', name: 'Halliburton Company', price: randomVariation(32, 2), change: randomVariation(-1.1, 0.3), changePercent: randomVariation(-3.4, 0.4) },
        { ticker: 'MRO', name: 'Marathon Oil Corporation', price: randomVariation(28, 2), change: randomVariation(-0.9, 0.3), changePercent: randomVariation(-3.2, 0.3) },
        { ticker: 'DVN', name: 'Devon Energy Corporation', price: randomVariation(42, 3), change: randomVariation(-1.3, 0.4), changePercent: randomVariation(-3.1, 0.3) },
        { ticker: 'KHC', name: 'Kraft Heinz Company', price: randomVariation(35, 2), change: randomVariation(-1.0, 0.3), changePercent: randomVariation(-3.0, 0.3) },
        { ticker: 'VFC', name: 'V.F. Corporation', price: randomVariation(18, 1), change: randomVariation(-0.5, 0.2), changePercent: randomVariation(-2.9, 0.3) },
        { ticker: 'PARA', name: 'Paramount Global', price: randomVariation(11, 1), change: randomVariation(-0.3, 0.1), changePercent: randomVariation(-2.8, 0.2) }
      ],
      mostActive: [
        { ticker: 'TSLA', name: 'Tesla, Inc.', price: randomVariation(375, 20), change: randomVariation(indexTrend * 18, 10), changePercent: randomVariation(indexTrend * 5, 3), volume: randomVariation(250000000, 50000000) },
        { ticker: 'AAPL', name: 'Apple Inc.', price: randomVariation(262, 15), change: randomVariation(indexTrend * 5, 3), changePercent: randomVariation(indexTrend * 2, 1.5), volume: randomVariation(180000000, 40000000) },
        { ticker: 'NVDA', name: 'NVIDIA Corporation', price: randomVariation(181, 10), change: randomVariation(indexTrend * 9, 4), changePercent: randomVariation(indexTrend * 5, 2), volume: randomVariation(160000000, 35000000) },
        { ticker: 'AMD', name: 'Advanced Micro Devices', price: randomVariation(142, 8), change: randomVariation(indexTrend * 7, 3), changePercent: randomVariation(indexTrend * 4.5, 2), volume: randomVariation(145000000, 30000000) },
        { ticker: 'AMZN', name: 'Amazon.com Inc.', price: randomVariation(225, 12), change: randomVariation(indexTrend * 6, 3), changePercent: randomVariation(indexTrend * 2.5, 1.5), volume: randomVariation(135000000, 28000000) },
        { ticker: 'META', name: 'Meta Platforms Inc.', price: randomVariation(655, 30), change: randomVariation(indexTrend * 30, 12), changePercent: randomVariation(indexTrend * 4.5, 2), volume: randomVariation(125000000, 25000000) },
        { ticker: 'MSFT', name: 'Microsoft Corporation', price: randomVariation(517, 25), change: randomVariation(indexTrend * 12, 5), changePercent: randomVariation(indexTrend * 2.3, 1.2), volume: randomVariation(115000000, 23000000) },
        { ticker: 'GOOGL', name: 'Alphabet Inc.', price: randomVariation(192, 10), change: randomVariation(indexTrend * 4, 2.5), changePercent: randomVariation(indexTrend * 2, 1.3), volume: randomVariation(98000000, 20000000) },
        { ticker: 'SOFI', name: 'SoFi Technologies', price: randomVariation(15, 1.5), change: randomVariation(indexTrend * 1, 0.8), changePercent: randomVariation(indexTrend * 6, 3), volume: randomVariation(92000000, 18000000) },
        { ticker: 'PLUG', name: 'Plug Power Inc.', price: randomVariation(3.2, 0.5), change: randomVariation(indexTrend * 0.3, 0.3), changePercent: randomVariation(indexTrend * 8, 4), volume: randomVariation(88000000, 17000000) },
        { ticker: 'F', name: 'Ford Motor Company', price: randomVariation(11, 1), change: randomVariation(indexTrend * 0.5, 0.4), changePercent: randomVariation(indexTrend * 4, 2.5), volume: randomVariation(83000000, 16000000) },
        { ticker: 'NIO', name: 'NIO Inc.', price: randomVariation(5.8, 0.6), change: randomVariation(indexTrend * 0.4, 0.4), changePercent: randomVariation(indexTrend * 7, 3.5), volume: randomVariation(79000000, 15000000) },
        { ticker: 'RIVN', name: 'Rivian Automotive', price: randomVariation(12, 1.2), change: randomVariation(indexTrend * 0.8, 0.7), changePercent: randomVariation(indexTrend * 6.5, 3.2), volume: randomVariation(74000000, 14000000) },
        { ticker: 'LCID', name: 'Lucid Group Inc.', price: randomVariation(2.8, 0.4), change: randomVariation(indexTrend * 0.2, 0.3), changePercent: randomVariation(indexTrend * 7.5, 4), volume: randomVariation(69000000, 13000000) },
        { ticker: 'INTC', name: 'Intel Corporation', price: randomVariation(23, 2), change: randomVariation(-indexTrend * 1.5, 1), changePercent: randomVariation(-indexTrend * 6, 3), volume: randomVariation(64000000, 12000000) }
      ],
      breadth: {
        advancing: Math.floor(randomVariation(indexTrend > 0 ? 2800 : 1600, 400)),
        declining: Math.floor(randomVariation(indexTrend > 0 ? 1200 : 2400, 400)),
        unchanged: Math.floor(randomVariation(310, 50)),
        advanceDeclineRatio: indexTrend > 0 ? randomVariation(2.1, 0.5) : randomVariation(0.7, 0.3),
        newHighs: Math.floor(randomVariation(indexTrend > 0 ? 320 : 120, 100)),
        newLows: Math.floor(randomVariation(indexTrend > 0 ? 85 : 280, 80)),
        upVolume: Math.floor(randomVariation(indexTrend > 0 ? 9500000000 : 4500000000, 2000000000)),
        downVolume: Math.floor(randomVariation(indexTrend > 0 ? 3800000000 : 8200000000, 1500000000)),
        sentiment: sentimentLabel
      }
    };
  };

  // Check market status
  const updateMarketStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;

    // Market hours: Monday-Friday, 9:30 AM - 4:00 PM ET
    const marketOpen = 9 * 60 + 30; // 9:30 AM
    const marketClose = 16 * 60; // 4:00 PM

    const isWeekday = day >= 1 && day <= 5;
    const isDuringMarketHours = currentTime >= marketOpen && currentTime < marketClose;

    marketStatus.value.isOpen = isWeekday && isDuringMarketHours;
  };

  // Initialize data
  const initialize = () => {
    if (marketData.value.indices.length === 0) {
      marketData.value = generateSampleData();
    }
    updateMarketStatus();
  };

  // Refresh market data
  const refreshMarketData = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In a real app, this would fetch fresh data from an API
    // For now, we'll just generate new sample data with slight variations
    const newData = generateSampleData();

    // Add slight random variations to make it feel "live"
    newData.indices = newData.indices.map(index => ({
      ...index,
      change: index.change + (Math.random() - 0.5) * 5,
      changePercent: index.changePercent + (Math.random() - 0.5) * 0.1
    }));

    marketData.value = newData;
    updateMarketStatus();
  };

  // Initialize on first use
  if (process.client) {
    initialize();
  }

  return {
    marketData,
    marketStatus,
    refreshMarketData,
    updateMarketStatus
  };
};
