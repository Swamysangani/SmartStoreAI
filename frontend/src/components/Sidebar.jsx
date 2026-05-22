import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { token, logout } = useContext(AuthContext);

  const tabs = [
    { id: 'inventory', label: 'Inventory Management' },
    { id: 'sales', label: 'Sales Dashboard' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white sticky top-0 flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-gray-800 text-blue-400">
        SmartStore AI
      </div>
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {!token ? (
          <button 
            onClick={() => setActiveTab('login')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'login' ? 'bg-blue-600 shadow-md' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            Login / Register
          </button>
        ) : (
          tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-blue-600 shadow-md text-white' : 'hover:bg-gray-800 text-gray-300'}`}
            >
              {tab.label}
            </button>
          ))
        )}
      </nav>
      {token && (
        <div className="p-6 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
