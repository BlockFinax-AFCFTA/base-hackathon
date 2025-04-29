import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = 'gpt-4o';

export const analyzeExportRequirements = async (req: Request, res: Response) => {
  try {
    const { product, originCountry, destinationCountry, productCategory, additionalDetails } = req.body;

    if (!product || !originCountry || !destinationCountry || !productCategory) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate the prompt for the OpenAI API
    const prompt = `
      I need a comprehensive export compliance analysis for the following scenario:

      Product: ${product}
      Origin Country: ${originCountry}
      Destination Country: ${destinationCountry}
      Product Category: ${productCategory}
      Additional Details: ${additionalDetails || 'None provided'}

      Please provide a detailed analysis in JSON format with the following structure:
      {
        "summary": "A brief overview of the export situation",
        "restrictionLevel": "HIGH/MEDIUM/LOW",
        "keyRequirements": ["List of key requirements for this export"],
        "restrictions": ["List of any restrictions or barriers"],
        "requiredDocuments": [
          {
            "name": "Document name",
            "description": "What this document is",
            "mandatory": boolean,
            "notes": "Any additional notes"
          }
        ],
        "tariffs": {
          "overview": "Brief overview of tariff situation",
          "estimatedRates": [
            {
              "category": "Type of tariff",
              "rate": "Estimated rate",
              "notes": "Additional notes"
            }
          ]
        },
        "regulations": [
          {
            "name": "Regulation name",
            "description": "Description of the regulation",
            "authority": "Governing authority",
            "link": "Link to official information (if available)"
          }
        ]
      }

      Base your response on known international trade regulations, customs requirements, and export control laws.
      For the restrictionLevel, use HIGH if there are significant barriers or restrictions, MEDIUM for moderate requirements, and LOW for minimal restrictions.
    `;

    // Call OpenAI API for analysis
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert in international trade regulations, customs procedures, and export compliance. Provide accurate, detailed guidance on export requirements between countries.'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2, // Lower temperature for more factual responses
    });

    const analysisContent = response.choices[0].message.content;
    
    if (!analysisContent) {
      throw new Error('Failed to generate analysis');
    }

    // Parse the JSON response
    const analysisData = JSON.parse(analysisContent);

    return res.status(200).json(analysisData);
  } catch (error) {
    console.error('Error analyzing export requirements:', error);
    return res.status(500).json({ 
      error: 'Failed to analyze export requirements',
      details: error.message 
    });
  }
};