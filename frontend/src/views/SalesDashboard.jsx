import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesDashboard = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://smartstoreai.onrender.com/api/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setProducts(data);
          if (data.length > 0) setSelectedProductId(data[0]._id);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };
    if (token) fetchProducts();
  }, [token]);

  // Reset insights when selected product changes
  useEffect(() => {
    setInsights(null);
  }, [selectedProductId]);

  const selectedProduct = products.find(p => p._id === selectedProductId);

  // SAFE DATA PARSING: Fallback arrays to prevent "a is not a function" errors
  const safeMonthlyRevenue = selectedProduct && Array.isArray(selectedProduct.monthlyRevenue) 
    ? selectedProduct.monthlyRevenue 
    : [];

  const handleFetchInsights = async () => {
    if (!selectedProduct) return;
    
    setIsFetchingInsights(true);
    setInsights(null);
    
    try {
      const res = await fetch('https://smartstoreai.onrender.com/api/ai/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          stock: selectedProduct.stock || 0,
          price: selectedProduct.price || 0,
          monthlyRevenue: safeMonthlyRevenue
        })
      });

      if (!res.ok) throw new Error('Failed to fetch insights');

      const data = await res.json();
      setInsights(data);
    } catch (error) {
      console.error(error);
      alert('Error fetching AI insights.');
    } finally {
      setIsFetchingInsights(false);
    }
  };

  const chartData = selectedProduct ? {
    labels: safeMonthlyRevenue.map(m => m.month || ''),
    datasets: [
      {
        label: 'Revenue ($)',
        data: safeMonthlyRevenue.map(m => m.revenue || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  } : null;

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-500 mt-1">Analyze revenue patterns and receive AI-driven pricing strategies.</p>
        </div>
        
        {!loadingProducts && products.length > 0 && (
          <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100">
            <span className="text-sm font-semibold text-gray-700 pl-2">Active Product:</span>
            <select 
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-800 font-medium min-w-[250px] shadow-sm cursor-pointer transition-all"
              value={selectedProductId} 
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loadingProducts ? (
        <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="text-gray-500 font-medium">Loading catalog data...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Catalog is Empty</h2>
          <p className="text-gray-500 max-w-md">You need to add products with historical sales data before generating AI insights. Head over to the Inventory tab!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-blue-500">📈</span> Product Performance Metrics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 rounded-2xl border border-blue-100/60 shadow-sm">
                  <div className="text-sm text-blue-600 font-semibold mb-1 uppercase tracking-wider">Current Price</div>
                  <div className="text-4xl font-black text-gray-900">${(selectedProduct?.price || 0).toFixed(2)}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-2xl border border-emerald-100/60 shadow-sm">
                  <div className="text-sm text-emerald-600 font-semibold mb-1 uppercase tracking-wider">Available Stock</div>
                  <div className="text-4xl font-black text-gray-900">{selectedProduct?.stock || 0} <span className="text-xl text-emerald-700/60">units</span></div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-6 rounded-2xl border border-purple-100/60 shadow-sm">
                  <div className="text-sm text-purple-600 font-semibold mb-1 uppercase tracking-wider">6-Mo Revenue</div>
                  <div className="text-4xl font-black text-gray-900">
                    ${safeMonthlyRevenue.reduce((acc, curr) => acc + (curr.revenue || 0), 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="h-80 w-full relative">
                {chartData && (
                  <Bar 
                    data={chartData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { 
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          padding: 12,
                          titleFont: { size: 14 },
                          bodyFont: { size: 14 }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          grid: { color: 'rgba(0,0,0,0.04)' },
                          border: { display: false }
                        },
                        x: {
                          grid: { display: false },
                          border: { display: false }
                        }
                      }
                    }} 
                  />
                )}
              </div>
            </div>
          </div>

          <div className="xl:col-span-1">
            <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-8 text-white h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  <span className="text-2xl">🤖</span> AI Data Consultant
                </h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                  Have Gemini analyze the active product's historical revenue trends alongside its current price point and inventory density to formulate actionable strategies.
                </p>

                <button 
                  onClick={handleFetchInsights}
                  disabled={isFetchingInsights}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all transform active:scale-[0.98] flex justify-center items-center gap-3 mb-8 disabled:from-gray-700 disabled:to-gray-800 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed group"
                >
                  {isFetchingInsights ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Synthesizing Data...
                    </>
                  ) : (
                    <>
                      <span className="text-xl group-hover:animate-bounce">✨</span> Fetch AI Sales Advice
                    </>
                  )}
                </button>
              </div>

              {insights && (
                <div className="space-y-6 flex-1 animate-fade-in relative z-10 flex flex-col justify-end">
                  <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-colors shadow-inner">
                    <h3 className="text-blue-400 font-bold flex items-center gap-2 mb-3 text-sm tracking-wide uppercase">
                      💡 Pricing Optimization Strategy
                    </h3>
                    <p className="text-gray-300 text-[15px] leading-relaxed">
                      {insights.pricingRecommendation}
                    </p>
                  </div>
                  
                  <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-colors shadow-inner">
                    <h3 className="text-purple-400 font-bold flex items-center gap-2 mb-3 text-sm tracking-wide uppercase">
                      📈 Demand & Seasonal Forecasting
                    </h3>
                    <p className="text-gray-300 text-[15px] leading-relaxed">
                      {insights.trendingInsights}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;