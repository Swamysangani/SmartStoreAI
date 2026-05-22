const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const { protect } = require('../middleware/authMiddleware');

// Protect all AI routes
router.use(protect);

// Initialize Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @route   POST /api/ai/generate
// @desc    Generate product data with Gemini, fallback automatically to Cohere if Gemini fails
router.post('/generate', async (req, res) => {
  const { name, category, features } = req.body;

  if (!name || !category) {
    return res.status(400).json({ message: 'Name and category are required' });
  }

  const prompt = `You are an expert e-commerce copywriter. Generate a conversion-focused e-commerce product description, exactly five SEO keywords (tags), and a catchy social media marketing caption with hashtags for the following product:
Name: ${name}
Category: ${category}
Features: ${features || 'None provided'}

Return ONLY a valid, raw JSON object without any markdown formatting wrappers (no \`\`\`json). The JSON must have exactly this structure:
{
  "description": "A conversion-focused e-commerce product description.",
  "tags": ["array", "of", "exactly", "five", "seo", "keywords"],
  "caption": "A catchy social media marketing caption with hashtags."
}`;

  // --- TRY METHOD 1: GOOGLE GEMINI ---
  try {
    console.log('🔄 Attempting content generation via Primary Engine (Gemini)...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Using highly stable 1.5-flash cluster
      contents: prompt,
      config: {
        systemInstruction: "Return ONLY a valid, raw JSON object matching the requested schema. No markdown formatting.",
        responseMimeType: "application/json",
      }
    });

    const resultJson = JSON.parse(response.text);
    console.log('✅ Success: Content generated using Gemini.');
    return res.json(resultJson);

  } catch (geminiError) {
    // Gemini failed (Traffic, quota, or network block) -> Triggering Fallback
    console.warn('⚠️ Primary Engine (Gemini) Failed or Out of Quota. Error details:', geminiError.message);
    console.log('🚀 Activating Secondary Fallback Engine (Cohere Command-R)...');

    // --- TRY METHOD 2: COHERE FALLBACK ---
    try {
      const cohereResponse = await fetch('https://api.cohere.com/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          model: 'command-r',
          message: prompt
        })
      });

      if (!cohereResponse.ok) {
        throw new Error(`Cohere API returned status code: ${cohereResponse.status}`);
      }

      const cohereData = await cohereResponse.json();
      const resultJson = JSON.parse(cohereData.text);
      
      console.log('✅ Success: Fallback content generated using Cohere.');
      return res.json(resultJson);

    } catch (cohereError) {
      // Both engines failed
      console.error('❌ Critical: Both Gemini and Cohere engines failed.', cohereError);
      return res.status(500).json({ message: 'All upstream AI services are temporarily down.' });
    }
  }
});

module.exports = router;