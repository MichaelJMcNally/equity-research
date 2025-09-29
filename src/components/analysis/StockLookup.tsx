'use client';

import { useState } from 'react';
import { useStock } from '@/hooks/useStock';

export default function StockLookup() {
  const [symbol, setSymbol] = useState('');
  const [searchSymbol, setSearchSymbol] = useState('');
  const { stock, loading, error } = useStock(searchSymbol);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      setSearchSymbol(symbol.trim().toUpperCase());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Stock Lookup</h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {stock && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">{stock.symbol}</h3>
              <p className="text-gray-600">{stock.name}</p>
              <p className="text-sm text-gray-500">{stock.sector}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">${stock.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                Market Cap: ${(stock.marketCap / 1000000000).toFixed(2)}B
              </p>
            </div>
          </div>
        </div>
      )}

      {searchSymbol && !loading && !stock && !error && (
        <div className="text-center text-gray-500">
          No data found for {searchSymbol}
        </div>
      )}
    </div>
  );
}