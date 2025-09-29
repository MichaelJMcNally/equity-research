const API_KEY = process.env.POLYGON_API_KEY;
const BASE_URL = 'https://api.polygon.io';

interface PolygonQuote {
  symbol: string;
  last_updated?: number;
  last?: {
    price?: number;
    timeframe?: string;
  };
  market_status?: string;
  name?: string;
}

interface PolygonAggregates {
  ticker: string;
  results?: Array<{
    c: number; // close
    h: number; // high
    l: number; // low
    o: number; // open
    t: number; // timestamp
    v: number; // volume
  }>;
}

interface PolygonTickerDetails {
  results?: {
    ticker: string;
    name: string;
    market_cap?: number;
    weighted_shares_outstanding?: number;
    share_class_shares_outstanding?: number;
    description?: string;
    sic_description?: string;
    type?: string;
  };
}

export class PolygonAPI {
  private static instance: PolygonAPI;
  private requestCount = 0;
  private lastResetTime = Date.now();

  static getInstance(): PolygonAPI {
    if (!PolygonAPI.instance) {
      PolygonAPI.instance = new PolygonAPI();
    }
    return PolygonAPI.instance;
  }

  private async makeRequest(endpoint: string): Promise<Record<string, unknown>> {
    // Rate limiting - free tier allows 5 requests per minute
    if (this.requestCount >= 5) {
      const timeSinceReset = Date.now() - this.lastResetTime;
      if (timeSinceReset < 60000) {
        const waitTime = 60000 - timeSinceReset;
        console.log(`Rate limit reached, waiting ${waitTime}ms`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        this.requestCount = 0;
        this.lastResetTime = Date.now();
      }
    }

    if (!API_KEY) {
      throw new Error('Polygon API key not configured');
    }

    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}apikey=${API_KEY}`;

    try {
      this.requestCount++;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Polygon API request failed:', error);
      throw error;
    }
  }

  async getStockQuote(symbol: string): Promise<PolygonQuote | null> {
    try {
      const data = await this.makeRequest(`/v2/snapshot/locale/us/markets/stocks/tickers/${symbol.toUpperCase()}`);
      const results = (data as { results?: PolygonQuote[] })?.results;
      return results?.[0] || null;
    } catch (error) {
      console.error(`Failed to get quote for ${symbol}:`, error);
      return null;
    }
  }

  async getHistoricalData(
    symbol: string,
    from: string,
    to: string = new Date().toISOString().split('T')[0]
  ): Promise<PolygonAggregates | null> {
    try {
      const data = await this.makeRequest(
        `/v2/aggs/ticker/${symbol.toUpperCase()}/range/1/day/${from}/${to}`
      );
      return data as unknown as PolygonAggregates;
    } catch (error) {
      console.error(`Failed to get historical data for ${symbol}:`, error);
      return null;
    }
  }

  async getTickerDetails(symbol: string): Promise<PolygonTickerDetails | null> {
    try {
      const data = await this.makeRequest(`/v3/reference/tickers/${symbol.toUpperCase()}`);
      return data as unknown as PolygonTickerDetails;
    } catch (error) {
      console.error(`Failed to get ticker details for ${symbol}:`, error);
      return null;
    }
  }

  async getMarketStatus(): Promise<Record<string, unknown> | null> {
    try {
      return await this.makeRequest('/v1/marketstatus/now');
    } catch (error) {
      console.error('Failed to get market status:', error);
      return null;
    }
  }

  async searchTickers(query: string): Promise<Record<string, unknown> | null> {
    try {
      return await this.makeRequest(`/v3/reference/tickers?search=${encodeURIComponent(query)}&limit=10`);
    } catch (error) {
      console.error(`Failed to search tickers for ${query}:`, error);
      return null;
    }
  }
}