import { PolygonAPI } from './polygon';
import type { Stock } from '@/lib/types';

export class StockService {
  private polygonAPI: PolygonAPI;

  constructor() {
    this.polygonAPI = PolygonAPI.getInstance();
  }

  async getStock(symbol: string): Promise<Stock | null> {
    try {
      const [quote, details] = await Promise.all([
        this.polygonAPI.getStockQuote(symbol),
        this.polygonAPI.getTickerDetails(symbol)
      ]);

      if (!quote || !details?.results) {
        return null;
      }

      const price = quote.last?.price || 0;
      const marketCap = details.results.market_cap || 0;

      return {
        symbol: symbol.toUpperCase(),
        name: details.results.name || symbol,
        price,
        change: 0, // Would need previous close to calculate
        changePercent: 0, // Would need previous close to calculate
        volume: 0, // Not available in snapshot
        marketCap,
        pe: null, // Would need earnings data
        dividend: null, // Would need dividend data
        sector: details.results.sic_description || 'Unknown',
        industry: details.results.type || 'Unknown'
      };
    } catch (error) {
      console.error(`Failed to get stock data for ${symbol}:`, error);
      return null;
    }
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
    try {
      const toDate = new Date().toISOString().split('T')[0];
      const fromDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const data = await this.polygonAPI.getHistoricalData(symbol, fromDate, toDate);

      if (!data?.results) {
        return [];
      }

      return data.results.map(result => ({
        date: new Date(result.t).toISOString().split('T')[0],
        price: result.c
      }));
    } catch (error) {
      console.error(`Failed to get historical data for ${symbol}:`, error);
      return [];
    }
  }

  async searchStocks(query: string): Promise<{symbol: string, name: string}[]> {
    try {
      const data = await this.polygonAPI.searchTickers(query);

      const results = (data as { results?: { ticker: string; name: string }[] })?.results;

      if (!results) {
        return [];
      }

      return results.map((result: { ticker: string; name: string }) => ({
        symbol: result.ticker,
        name: result.name
      }));
    } catch (error) {
      console.error(`Failed to search stocks for ${query}:`, error);
      return [];
    }
  }

  async getMarketOverview(): Promise<{
    sp500: number;
    nasdaq: number;
    vix: number;
    treasury10y: number;
  }> {
    try {
      // For demo purposes, returning mock data
      // In production, you'd fetch real market indices
      return {
        sp500: 4350.50,
        nasdaq: 13450.30,
        vix: 16.8,
        treasury10y: 4.2
      };
    } catch (error) {
      console.error('Failed to get market overview:', error);
      return {
        sp500: 0,
        nasdaq: 0,
        vix: 0,
        treasury10y: 0
      };
    }
  }
}

export const stockService = new StockService();