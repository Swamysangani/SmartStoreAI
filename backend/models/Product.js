const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  marketingCaption: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  monthlyRevenue: [{
    month: { type: String, required: true },
    revenue: { type: Number, required: true, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
