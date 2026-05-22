import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = ({ setActiveTab }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('admin@smartstore.com');
  const [password, setPassword] = useState('password123');
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('AdminUser');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/auth/signup' : '/api/auth/login';
    const body = isRegistering ? { username, email, password } : { email, password };

    try {
      const res = await fetch(`https://smartstoreai.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        login(data.token);
        setActiveTab('inventory');
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server. Is the backend running?');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        {isRegistering ? 'Create Account' : 'Welcome Back'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {isRegistering && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={username} onChange={e => setUsername(e.target.value)} required 
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={email} onChange={e => setEmail(e.target.value)} required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            value={password} onChange={e => setPassword(e.target.value)} required 
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transform active:scale-[0.98] transition-all shadow-md">
          {isRegistering ? 'Sign Up' : 'Log In'}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-500 text-sm">
        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
        <button onClick={() => setIsRegistering(!isRegistering)} className="text-blue-600 font-medium hover:text-blue-700 hover:underline">
          {isRegistering ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default Login;
