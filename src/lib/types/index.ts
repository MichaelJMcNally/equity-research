export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number | null;
  dividend: number | null;
  sector: string;
  industry: string;
}

export interface FinancialMetrics {
  revenue: number;
  netIncome: number;
  eps: number;
  roe: number;
  roa: number;
  debtToEquity: number;
  currentRatio: number;
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
}

export interface Portfolio {
  id: string;
  name: string;
  stocks: PortfolioPosition[];
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
}

export interface PortfolioPosition {
  symbol: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
}

export interface ScreeningCriteria {
  minMarketCap?: number;
  maxMarketCap?: number;
  minPE?: number;
  maxPE?: number;
  minDividend?: number;
  sectors?: string[];
  minROE?: number;
  maxDebtToEquity?: number;
}