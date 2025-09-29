'use client';

import type { Portfolio } from '@/lib/types';

interface PortfolioOverviewProps {
  portfolio?: Portfolio;
}

export default function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  if (!portfolio) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
        <p className="text-gray-500">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">{portfolio.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-600">Total Value</h3>
          <p className="text-2xl font-bold text-blue-900">
            ${portfolio.totalValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-600">Total Return</h3>
          <p className="text-2xl font-bold text-green-900">
            ${portfolio.totalReturn.toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-600">Return %</h3>
          <p className="text-2xl font-bold text-purple-900">
            {portfolio.totalReturnPercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Symbol</th>
              <th className="text-right py-2">Shares</th>
              <th className="text-right py-2">Avg Cost</th>
              <th className="text-right py-2">Current Price</th>
              <th className="text-right py-2">Market Value</th>
              <th className="text-right py-2">Gain/Loss</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.stocks.map((position) => (
              <tr key={position.symbol} className="border-b">
                <td className="py-2 font-medium">{position.symbol}</td>
                <td className="text-right py-2">{position.shares.toLocaleString()}</td>
                <td className="text-right py-2">${position.avgCost.toFixed(2)}</td>
                <td className="text-right py-2">${position.currentPrice.toFixed(2)}</td>
                <td className="text-right py-2">${position.marketValue.toLocaleString()}</td>
                <td className={`text-right py-2 ${position.unrealizedGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${position.unrealizedGain.toLocaleString()} ({position.unrealizedGainPercent.toFixed(2)}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}