'use client';

import { useState } from 'react';
import type { ScreeningCriteria } from '@/lib/types';

export default function StockScreener() {
  const [criteria, setCriteria] = useState<ScreeningCriteria>({});

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Stock Screener</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Min Market Cap</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 1000000000"
            onChange={(e) => setCriteria({...criteria, minMarketCap: Number(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max P/E Ratio</label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 25"
            onChange={(e) => setCriteria({...criteria, maxPE: Number(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Dividend Yield</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 2.5"
            onChange={(e) => setCriteria({...criteria, minDividend: Number(e.target.value)})}
          />
        </div>
      </div>

      <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Screen Stocks
      </button>
    </div>
  );
}