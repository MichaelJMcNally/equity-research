'use client';

import { useState, useEffect } from 'react';
import type { Stock } from '@/lib/types';

export function useStock(symbol: string) {
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchStock = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/stocks/${symbol}`);

        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const data = await response.json();
        setStock(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [symbol]);

  return { stock, loading, error };
}

export function useMarketOverview() {
  const [data, setData] = useState<{
    sp500: number;
    nasdaq: number;
    vix: number;
    treasury10y: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/market/overview');

        if (!response.ok) {
          throw new Error('Failed to fetch market overview');
        }

        const overview = await response.json();
        setData(overview);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return { data, loading, error };
}

export function useStockSearch(query: string) {
  const [results, setResults] = useState<Array<{symbol: string, name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchStocks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
          throw new Error('Failed to search stocks');
        }

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchStocks, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
}