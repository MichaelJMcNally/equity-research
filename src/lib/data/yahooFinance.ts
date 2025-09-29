interface YahooQuoteResponse {
  quoteResponse: {
    result: Array<{
      symbol: string;
      shortName?: string;
      longName?: string;
      regularMarketPrice?: number;
      regularMarketChange?: number;
      regularMarketChangePercent?: number;
      regularMarketVolume?: number;
      marketCap?: number;
      trailingPE?: number;
      dividendYield?: number;
      sector?: string;
      industry?: string;
      exchange?: string;
    }>;
    error?: unknown;
  };
}

interface YahooHistoricalResponse {
  chart: {
    result: Array<{
      timestamp: number[];
      indicators: {
        quote: Array<{
          close: number[];
          open: number[];
          high: number[];
          low: number[];
          volume: number[];
        }>;
      };
    }>;
    error?: unknown;
  };
}

export class YahooFinanceAPI {
  private static instance: YahooFinanceAPI;
  private requestCount = 0;
  private lastResetTime = Date.now();

  static getInstance(): YahooFinanceAPI {
    if (!YahooFinanceAPI.instance) {
      YahooFinanceAPI.instance = new YahooFinanceAPI();
    }
    return YahooFinanceAPI.instance;
  }

  private async makeRequest(url: string): Promise<Record<string, unknown>> {
    // Basic rate limiting - be respectful to Yahoo's servers
    if (this.requestCount >= 10) {
      const timeSinceReset = Date.now() - this.lastResetTime;
      if (timeSinceReset < 60000) {
        const waitTime = 60000 - timeSinceReset;
        console.log(`Rate limit reached, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.lastResetTime = Date.now();
      }
    }

    try {
      this.requestCount++;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; equity-research-app)',
        },
      });

      if (!response.ok) {
        throw new Error(`Yahoo Finance API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Yahoo Finance API request failed:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<YahooQuoteResponse | null> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/quote?symbols=${symbol.toUpperCase()}`;
      const data = await this.makeRequest(url);
      return data as unknown as YahooQuoteResponse;
    } catch (error) {
      console.error(`Failed to get quote for ${symbol}:`, error);
      return null;
    }
  }

  async getHistoricalData(
    symbol: string,
    period1: number,
    period2: number = Math.floor(Date.now() / 1000)
  ): Promise<YahooHistoricalResponse | null> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol.toUpperCase()}?period1=${period1}&period2=${period2}&interval=1d`;
      const data = await this.makeRequest(url);
      return data as unknown as YahooHistoricalResponse;
    } catch (error) {
      console.error(`Failed to get historical data for ${symbol}:`, error);
      return null;
    }
  }

  async searchStocks(query: string): Promise<Record<string, unknown> | null> {
    try {
      const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=10&newsCount=0`;
      return await this.makeRequest(url);
    } catch (error) {
      console.error(`Failed to search stocks for ${query}:`, error);
      return null;
    }
  }

  async getMarketSummary(): Promise<Record<string, unknown> | null> {
    try {
      const url = 'https://query1.finance.yahoo.com/v8/finance/quote?symbols=%5EGSPC,%5EIXIC,%5EVIX,^TNX';
      return await this.makeRequest(url);
    } catch (error) {
      console.error('Failed to get market summary:', error);
      return null;
    }
  }
}