import React from 'react';

const SalesDashboard = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-500 mt-1">View revenue analytics and AI insights.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px] flex items-center justify-center text-center p-8">
        <div>
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sales Analytics Coming Soon</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            This module will integrate with our backend to visualize your product performance and surface AI-driven pricing recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
