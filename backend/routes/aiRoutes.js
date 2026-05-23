const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const { protect } = require('../middleware/authMiddleware');

// Protect all AI routes
router.use(protect);

// Initialize Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @route   POST /api/ai/generate
// @desc    Generate product description, tags, and caption using AI
router.post('/generate', async (req, res) => {
  const { name, category, features } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }

  const prompt = `Generate a conversion-focused e-commerce product description, exactly five SEO keywords (tags), and a catchy social media marketing caption with hashtags for the following product:
Name: ${name}
Category: ${category}
Features: ${features || 'None provided'}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are an expert e-commerce copywriter. Return ONLY a valid, raw JSON object without any markdown formatting wrappers (no \`\`\`json). The JSON must have exactly this structure:
{
  "description": "A conversion-focused e-commerce product description.",
  "tags": ["array", "of", "exactly", "five", "seo", "keywords"],
  "caption": "A catchy social media marketing caption with hashtags."
}`,
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText);
    res.json(resultJson);
    
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
});

// @route   POST /api/ai/insights
// @desc    Generate sales insights and pricing recommendations
router.post('/insights', async (req, res) => {
  const { stock, price, monthlyRevenue } = req.body;

  // Safeguard parameters: if stock or price are missing, default them to 0 to prevent crashes
  const safeStock = stock !== undefined ? stock : 0;
  const safePrice = price !== undefined ? price : 0;
  const safeRevenue = monthlyRevenue ? monthlyRevenue : [0, 0, 0];

  const prompt = `Analyze the following product data:
Current Stock: ${safeStock}
Current Price: $${safePrice}
Historical Monthly Revenue: ${JSON.stringify(safeRevenue)}`;

  try {
    console.log('🔄 Requesting insights from Gemini...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Matched perfectly to your working generation route!
      contents: prompt,
      config: {
        systemInstruction: `You are a professional e-commerce data consultant. Analyze the numerical stock and historical sales trends provided. Return ONLY a valid, raw JSON object without any markdown formatting wrappers (no \`\`\`json). The JSON must have exactly this structure:
{
  "pricingRecommendation": "A detailed strategy on whether the store owner should raise, lower, or maintain the item price based on sales volume.",
  "trendingInsights": "A critical summary outlining seasonal sales patterns, demand drops, or stock clearance advice based on the metrics."
}`,
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text;
    const resultJson = JSON.parse(resultText);
    
    console.log('✅ Success: Insights generated cleanly!');
    res.json(resultJson);
    
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ message: 'Failed to generate insights' });
  }
});

module.exports = router;