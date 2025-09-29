'use client';

interface StockChartProps {
  symbol: string;
  data?: Array<{
    date: string;
    price: number;
  }>;
}

export default function StockChart({ symbol }: StockChartProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">{symbol} Price Chart</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">Chart component will be implemented with chart library</p>
      </div>
    </div>
  );
}