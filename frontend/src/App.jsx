import React, { useState, useContext, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Login from './views/Login';
import Inventory from './views/Inventory';
import SalesDashboard from './views/SalesDashboard';
import { AuthContext } from './context/AuthContext';

function App() {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(token ? 'inventory' : 'login');

  useEffect(() => {
    if (!token) setActiveTab('login');
    else if (activeTab === 'login') setActiveTab('inventory');
  }, [token, activeTab]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto w-full">
        {activeTab === 'login' && <Login setActiveTab={setActiveTab} />}
        {activeTab === 'inventory' && token && <Inventory />}
        {activeTab === 'sales' && token && <SalesDashboard />}
      </main>
    </div>
  );
}

export default App;
