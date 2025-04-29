import { Router, Request, Response } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Define the prompt for regulatory guidelines
const systemPrompt = `You are an expert in international trade regulations and compliance. 
Your role is to help exporters understand the regulatory requirements for their specific products when exporting 
to different countries.

For each query, provide detailed information about:
1. Required export documentation and licenses
2. Product-specific certifications or standards
3. Customs duties and tariffs
4. Import restrictions or prohibitions in the destination country
5. Labeling and packaging requirements
6. Any other relevant regulatory considerations

Format your response in a structured way, with clear sections, and provide actionable guidance.
Ensure your information is accurate and up-to-date as of your last training data.`;

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { product, originCountry, destinationCountry, productCategory } = req.body;

    if (!product || !originCountry || !destinationCountry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const userPrompt = `Please provide regulatory guidance for exporting the following:
    
Product: ${product}
Product Category: ${productCategory || 'Not specified'}
Origin Country: ${originCountry}
Destination Country: ${destinationCountry}

Focus on the most important regulations and compliance requirements for this specific export scenario.`;

    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
    });

    const analysis = response.choices[0].message.content;

    res.json({
      analysis,
      metadata: {
        product,
        originCountry,
        destinationCountry,
        productCategory,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error in regulatory AI analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze regulatory requirements',
      details: error.message
    });
  }
});

export default router;