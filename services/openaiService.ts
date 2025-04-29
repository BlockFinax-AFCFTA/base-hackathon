import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Service to handle AI-powered translations using OpenAI
 */
export class OpenAIService {
  /**
   * Translates text from English to the target language using OpenAI
   * @param text The text to translate (in English)
   * @param targetLanguage The language code to translate to
   * @returns Translated text
   */
  static async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      // Skip translation if text is empty or if target language is English
      if (!text.trim() || targetLanguage === 'en') {
        return text;
      }

      const languageNames: Record<string, string> = {
        en: 'English',
        es: 'Spanish',
        zh: 'Chinese',
        fr: 'French',
        ar: 'Arabic',
        ru: 'Russian'
      };

      const targetLanguageName = languageNames[targetLanguage] || targetLanguage;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the following text from English to ${targetLanguageName}. Maintain the tone, formality, and meaning of the original text. Only respond with the translated text, no explanations or additional commentary.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent translations
        max_tokens: 1000
      });

      return response.choices[0].message.content || text;
    } catch (error: any) {
      console.error("OpenAI translation error:", error);
      throw new Error(`Translation failed: ${error.message || 'Unknown error'}`);
    }
  }
}