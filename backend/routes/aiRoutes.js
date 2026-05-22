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
    console.log('🔄 Requesting content from Gemini...');
    
    // FIXED: Changed to 'gemini-2.5-flash' without any prefixes. 
    // The SDK handles the rest natively!
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

    console.log('✅ Success: Content generated cleanly!');
    res.json(resultJson);
    
  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ message: 'Failed to generate content' });
  }
});

module.exports = router;