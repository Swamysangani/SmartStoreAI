import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Inventory = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    features: '',
    description: '',
    tags: '',
    marketingCaption: '',
    price: '',
    stock: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleAIGenerate = async () => {
    if (!formData.name || !formData.category) {
      alert("Please provide at least a Product Name and Category to generate content.");
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('https://smartstoreai.onrender.com/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          features: formData.features
        })
      });

      if (!res.ok) throw new Error('AI Generation failed');

      const data = await res.json();
      
      setFormData(prev => ({
        ...prev,
        description: data.description || '',
        tags: data.tags ? data.tags.join(', ') : '',
        marketingCaption: data.caption || ''
      }));

    } catch (err) {
      console.error(err);
      alert("Failed to generate AI content. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Product added successfully!");
        setFormData({ name: '', category: '', features: '', description: '', tags: '', marketingCaption: '', price: '', stock: '' });
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage your store products and generate AI content.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-8">
            {/* Input Section */}
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-900 border-b pb-3 mb-4">Basic Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Wireless Noise-Canceling Headphones" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Electronics" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Features (optional)</label>
                <textarea name="features" value={formData.features} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all h-28 resize-none" placeholder="e.g. 40 hours battery life, Bluetooth 5.3, Active Noise Cancellation..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                  <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              
              <div className="pt-4">
                <button 
                  type="button" 
                  onClick={handleAIGenerate} 
                  disabled={isGenerating || !formData.name || !formData.category} 
                  className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md ${isGenerating || (!formData.name || !formData.category) ? 'bg-indigo-300 cursor-not-allowed text-white' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg transform active:scale-[0.98]'}`}
                >
                  {isGenerating ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating AI Content...
                    </span>
                  ) : (
                    <span>✨ Generate AI Content & Metadata</span>
                  )}
                </button>
              </div>
            </div>

            {/* AI Generated Output Section */}
            <div className="space-y-5 bg-indigo-50/30 p-6 rounded-2xl border border-indigo-50/50">
              <h3 className="font-semibold text-indigo-900 border-b border-indigo-100 pb-3 mb-4 flex items-center gap-2">
                <span>🤖</span> AI Generated Content
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-3 bg-white border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none h-36 resize-none shadow-sm" placeholder="Click 'Generate' to let AI write a conversion-focused description..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Tags (comma separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="w-full p-3 bg-white border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm" placeholder="e.g. tag1, tag2, tag3" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Caption</label>
                <textarea name="marketingCaption" value={formData.marketingCaption} onChange={handleChange} className="w-full p-3 bg-white border border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none h-28 resize-none shadow-sm" placeholder="AI social media caption with hashtags..." />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex justify-end">
            <button type="submit" className="bg-gray-900 hover:bg-black text-white px-10 py-3.5 rounded-lg font-bold transition-all shadow-md transform active:scale-[0.98]">
              Save to Catalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
