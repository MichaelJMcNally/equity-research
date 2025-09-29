import type { Stock } from '@/lib/types';

const MOCK_STOCKS: Record<string, Stock> = {
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.15,
    changePercent: 1.24,
    volume: 45234567,
    marketCap: 2750000000000,
    pe: 28.5,
    dividend: 0.96,
    sector: 'Technology',
    industry: 'Consumer Electronics'
  },
  TSLA: {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.87,
    change: -5.32,
    changePercent: -2.09,
    volume: 123456789,
    marketCap: 790000000000,
    pe: 65.2,
    dividend: null,
    sector: 'Consumer Discretionary',
    industry: 'Auto Manufacturers'
  },
  MSFT: {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 1.92,
    changePercent: 0.51,
    volume: 23456789,
    marketCap: 2810000000000,
    pe: 32.1,
    dividend: 3.00,
    sector: 'Technology',
    industry: 'Software - Infrastructure'
  },
  GOOGL: {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: 0.87,
    changePercent: 0.63,
    volume: 34567890,
    marketCap: 1750000000000,
    pe: 26.8,
    dividend: null,
    sector: 'Communication Services',
    industry: 'Internet Content & Information'
  },
  AMZN: {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 145.32,
    change: -1.23,
    changePercent: -0.84,
    volume: 45678901,
    marketCap: 1520000000000,
    pe: 42.5,
    dividend: null,
    sector: 'Consumer Discretionary',
    industry: 'Internet Retail'
  },
  NVDA: {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.29,
    change: 12.45,
    changePercent: 1.44,
    volume: 56789012,
    marketCap: 2150000000000,
    pe: 68.4,
    dividend: 0.16,
    sector: 'Technology',
    industry: 'Semiconductors'
  }
};

export class MockDataService {
  private static instance: MockDataService;

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  async getStock(symbol: string): Promise<Stock | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));

    const stock = MOCK_STOCKS[symbol.toUpperCase()];
    if (!stock) return null;

    // Add some random price variation to simulate real-time data
    const variation = (Math.random() - 0.5) * 0.02; // ±1%
    const newPrice = stock.price * (1 + variation);
    const priceChange = newPrice - stock.price;
    const percentChange = (priceChange / stock.price) * 100;

    return {
      ...stock,
      price: Number(newPrice.toFixed(2)),
      change: Number(priceChange.toFixed(2)),
      changePercent: Number(percentChange.toFixed(2))
    };
  }

  async getMultipleStocks(symbols: string[]): Promise<Stock[]> {
    const promises = symbols.map(symbol => this.getStock(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<Stock> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  async getHistoricalPrices(symbol: string, days: number = 30): Promise<Array<{date: string, price: number}>> {
    const stock = MOCK_STOCKS[symbol.toUpperCase()];
    if (!stock) return [];

    const prices: Array<{date: string, price: number}> = [];
    let currentPrice = stock.price;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Simulate price movement
      const change = (Math.random() - 0.5) * 0.05; // ±2.5% daily variation
      currentPrice *= (1 + change);

      prices.push({
        date: date.toISOString().split('T')[0],
        price: Number(currentPrice.toFixed(2))
      });
    }

    return prices;
  }

  async searchStocks(query: string): Promise<{symbol: string, name: string}[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const results = Object.values(MOCK_STOCKS)
      .filter(stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(stock => ({
        symbol: stock.symbol,
        name: stock.name
      }));

    return results.slice(0, 10);
  }

  async getMarketOverview(): Promise<{
    sp500: number;
    nasdaq: number;
    vix: number;
    treasury10y: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 100));

    // Add some random variation to mock real-time market data
    const sp500Base = 4450.50;
    const nasdaqBase = 13850.30;
    const vixBase = 16.8;
    const treasury10yBase = 4.2;

    return {
      sp500: Number((sp500Base * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
      nasdaq: Number((nasdaqBase * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2)),
      vix: Number((vixBase * (1 + (Math.random() - 0.5) * 0.05)).toFixed(1)),
      treasury10y: Number((treasury10yBase * (1 + (Math.random() - 0.5) * 0.02)).toFixed(2))
    };
  }
}