import { YahooFinanceAPI } from './yahooFinance';
import { MockDataService } from './mockData';
import type { Stock } from '@/lib/types';

export class StockService {
  private yahooAPI: YahooFinanceAPI;
  private mockAPI: MockDataService;
  private useMockData: boolean;

  constructor() {
    this.yahooAPI = YahooFinanceAPI.getInstance();
    this.mockAPI = MockDataService.getInstance();
    // Use mock data in development or when Yahoo Finance fails
    this.useMockData = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true';
  }

  async getStock(symbol: string): Promise<Stock | null> {
    if (this.useMockData) {
      return this.mockAPI.getStock(symbol);
    }

    try {
      const quoteData = await this.yahooAPI.getStockQuote(symbol);

      if (!quoteData?.quoteResponse?.result?.[0]) {
        // Fallback to mock data if Yahoo Finance fails
        console.log(`Yahoo Finance failed for ${symbol}, falling back to mock data`);
        return this.mockAPI.getStock(symbol);
      }

      const quote = quoteData.quoteResponse.result[0];

      return {
        symbol: quote.symbol,
        name: quote.longName || quote.shortName || quote.symbol,
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
        pe: quote.trailingPE || null,
        dividend: quote.dividendYield || null,
        sector: quote.sector || 'Unknown',
        industry: quote.industry || 'Unknown'
      };
    } catch (error) {
      console.error(`Failed to get stock data for ${symbol}:`, error);
      // Fallback to mock data if Yahoo Finance fails
      return this.mockAPI.getStock(symbol);
    }
  }

  async getMultipleStocks(symbols: string[]): Promise<Stock[]> {
    if (this.useMockData) {
      return this.mockAPI.getMultipleStocks(symbols);
    }

    const promises = symbols.map(symbol => this.getStock(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter((result): result is PromiseFulfilledResult<Stock> =>
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  async getHistoricalPrices(symbol: string, days: number = 30): Promise<Array<{date: string, price: number}>> {
    if (this.useMockData) {
      return this.mockAPI.getHistoricalPrices(symbol, days);
    }

    try {
      const period2 = Math.floor(Date.now() / 1000);
      const period1 = period2 - (days * 24 * 60 * 60);

      const data = await this.yahooAPI.getHistoricalData(symbol, period1, period2);

      if (!data?.chart?.result?.[0]?.timestamp || !data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close) {
        return this.mockAPI.getHistoricalPrices(symbol, days);
      }

      const timestamps = data.chart.result[0].timestamp;
      const closes = data.chart.result[0].indicators.quote[0].close;

      return timestamps.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        price: closes[index] || 0
      })).filter(item => item.price > 0);
    } catch (error) {
      console.error(`Failed to get historical data for ${symbol}:`, error);
      return this.mockAPI.getHistoricalPrices(symbol, days);
    }
  }

  async searchStocks(query: string): Promise<{symbol: string, name: string}[]> {
    if (this.useMockData) {
      return this.mockAPI.searchStocks(query);
    }

    try {
      const data = await this.yahooAPI.searchStocks(query);

      const typedData = data as { quotes?: Array<{ typeDisp?: string; symbol: string; shortname?: string; longname?: string }> };

      if (!typedData?.quotes) {
        return this.mockAPI.searchStocks(query);
      }

      return typedData.quotes
        .filter((quote) => quote.typeDisp === 'Equity')
        .map((quote) => ({
          symbol: quote.symbol,
          name: quote.shortname || quote.longname || quote.symbol
        }))
        .slice(0, 10);
    } catch (error) {
      console.error(`Failed to search stocks for ${query}:`, error);
      return this.mockAPI.searchStocks(query);
    }
  }

  async getMarketOverview(): Promise<{
    sp500: number;
    nasdaq: number;
    vix: number;
    treasury10y: number;
  }> {
    if (this.useMockData) {
      return this.mockAPI.getMarketOverview();
    }

    try {
      const data = await this.yahooAPI.getMarketSummary();

      const typedMarketData = data as { quoteResponse?: { result?: Array<{ symbol: string; regularMarketPrice?: number }> } };

      if (!typedMarketData?.quoteResponse?.result) {
        throw new Error('No market data available');
      }

      const results = typedMarketData.quoteResponse.result;
      const sp500 = results.find((r: { symbol: string; regularMarketPrice?: number }) => r.symbol === '^GSPC')?.regularMarketPrice || 0;
      const nasdaq = results.find((r: { symbol: string; regularMarketPrice?: number }) => r.symbol === '^IXIC')?.regularMarketPrice || 0;
      const vix = results.find((r: { symbol: string; regularMarketPrice?: number }) => r.symbol === '^VIX')?.regularMarketPrice || 0;
      const treasury10y = results.find((r: { symbol: string; regularMarketPrice?: number }) => r.symbol === '^TNX')?.regularMarketPrice || 0;

      return {
        sp500,
        nasdaq,
        vix,
        treasury10y
      };
    } catch (error) {
      console.error('Failed to get market overview:', error);
      return this.mockAPI.getMarketOverview();
    }
  }
}

export const stockService = new StockService();