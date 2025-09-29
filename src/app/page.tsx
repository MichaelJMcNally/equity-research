import StockScreener from '@/components/screening/StockScreener';
import PortfolioOverview from '@/components/portfolio/PortfolioOverview';
import StockChart from '@/components/charts/StockChart';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Equity Research Platform</h1>
            <nav className="space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Screener</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Portfolio</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Analysis</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StockChart symbol="SPY" />
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600">S&P 500</h3>
                  <p className="text-2xl font-bold text-green-600">+1.2%</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600">NASDAQ</h3>
                  <p className="text-2xl font-bold text-red-600">-0.5%</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600">VIX</h3>
                  <p className="text-2xl font-bold text-gray-900">16.8</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-sm font-medium text-gray-600">10Y Treasury</h3>
                  <p className="text-2xl font-bold text-gray-900">4.2%</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <PortfolioOverview />
          </section>

          <section>
            <StockScreener />
          </section>
        </div>
      </main>
    </div>
  );
}
