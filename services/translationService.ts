import { Language } from '../context/LanguageContext';
import { OpenAIService } from './openaiService';

/**
 * Translation service that handles dynamic content translation
 * Combines local dictionary lookup with OpenAI API for advanced translations
 */
export class TranslationService {
  // Basic dictionary of common words/phrases for each language
  private static commonPhrases: Record<Language, Record<string, string>> = {
    en: {},  // English is the base language
    es: {
      "Hello": "Hola",
      "Welcome": "Bienvenido",
      "Thank you": "Gracias",
      "Yes": "Sí",
      "No": "No",
      "Please": "Por favor",
      "Contract": "Contrato",
      "Payment": "Pago",
      "Shipping": "Envío",
      "Document": "Documento",
      "Funds": "Fondos",
      "Wallet": "Billetera",
      "Balance": "Saldo",
      "Transaction": "Transacción",
      "Verification": "Verificación",
      "Complete": "Completo",
      "Pending": "Pendiente",
      "Approved": "Aprobado",
      "Rejected": "Rechazado",
      "Amount": "Monto",
      "Date": "Fecha",
      "Status": "Estado",
      "Buyer": "Comprador",
      "Seller": "Vendedor",
      "Save": "Guardar",
      "Cancel": "Cancelar",
      "Edit": "Editar",
      "Delete": "Eliminar",
      "View": "Ver",
      "Details": "Detalles",
      "Loading": "Cargando",
      "Error": "Error",
      "Success": "Éxito"
    },
    zh: {
      "Hello": "你好",
      "Welcome": "欢迎",
      "Thank you": "谢谢",
      "Yes": "是",
      "No": "否",
      "Please": "请",
      "Contract": "合同",
      "Payment": "付款",
      "Shipping": "运输",
      "Document": "文档",
      "Funds": "资金",
      "Wallet": "钱包",
      "Balance": "余额",
      "Transaction": "交易",
      "Verification": "验证",
      "Complete": "完成",
      "Pending": "待处理",
      "Approved": "已批准",
      "Rejected": "已拒绝",
      "Amount": "金额",
      "Date": "日期",
      "Status": "状态",
      "Buyer": "买方",
      "Seller": "卖方",
      "Save": "保存",
      "Cancel": "取消",
      "Edit": "编辑",
      "Delete": "删除",
      "View": "查看",
      "Details": "详情",
      "Loading": "加载中",
      "Error": "错误",
      "Success": "成功"
    },
    fr: {
      "Hello": "Bonjour",
      "Welcome": "Bienvenue",
      "Thank you": "Merci",
      "Yes": "Oui",
      "No": "Non",
      "Please": "S'il vous plaît",
      "Contract": "Contrat",
      "Payment": "Paiement",
      "Shipping": "Expédition",
      "Document": "Document",
      "Funds": "Fonds",
      "Wallet": "Portefeuille",
      "Balance": "Solde",
      "Transaction": "Transaction",
      "Verification": "Vérification",
      "Complete": "Complet",
      "Pending": "En attente",
      "Approved": "Approuvé",
      "Rejected": "Rejeté",
      "Amount": "Montant",
      "Date": "Date",
      "Status": "Statut",
      "Buyer": "Acheteur",
      "Seller": "Vendeur",
      "Save": "Enregistrer",
      "Cancel": "Annuler",
      "Edit": "Modifier",
      "Delete": "Supprimer",
      "View": "Voir",
      "Details": "Détails",
      "Loading": "Chargement",
      "Error": "Erreur",
      "Success": "Succès"
    },
    ar: {
      "Hello": "مرحبا",
      "Welcome": "أهلا بك",
      "Thank you": "شكرا لك",
      "Yes": "نعم",
      "No": "لا",
      "Please": "من فضلك",
      "Contract": "عقد",
      "Payment": "دفع",
      "Shipping": "شحن",
      "Document": "وثيقة",
      "Funds": "أموال",
      "Wallet": "محفظة",
      "Balance": "رصيد",
      "Transaction": "معاملة",
      "Verification": "تحقق",
      "Complete": "مكتمل",
      "Pending": "قيد الانتظار",
      "Approved": "موافق عليه",
      "Rejected": "مرفوض",
      "Amount": "مبلغ",
      "Date": "تاريخ",
      "Status": "حالة",
      "Buyer": "مشتري",
      "Seller": "بائع",
      "Save": "حفظ",
      "Cancel": "إلغاء",
      "Edit": "تعديل",
      "Delete": "حذف",
      "View": "عرض",
      "Details": "تفاصيل",
      "Loading": "جار التحميل",
      "Error": "خطأ",
      "Success": "نجاح"
    },
    ru: {
      "Hello": "Привет",
      "Welcome": "Добро пожаловать",
      "Thank you": "Спасибо",
      "Yes": "Да",
      "No": "Нет",
      "Please": "Пожалуйста",
      "Contract": "Контракт",
      "Payment": "Платеж",
      "Shipping": "Доставка",
      "Document": "Документ",
      "Funds": "Средства",
      "Wallet": "Кошелек",
      "Balance": "Баланс",
      "Transaction": "Транзакция",
      "Verification": "Проверка",
      "Complete": "Завершено",
      "Pending": "В ожидании",
      "Approved": "Одобрено",
      "Rejected": "Отклонено",
      "Amount": "Сумма",
      "Date": "Дата",
      "Status": "Статус",
      "Buyer": "Покупатель",
      "Seller": "Продавец",
      "Save": "Сохранить",
      "Cancel": "Отменить",
      "Edit": "Редактировать",
      "Delete": "Удалить",
      "View": "Просмотр",
      "Details": "Детали",
      "Loading": "Загрузка",
      "Error": "Ошибка",
      "Success": "Успех"
    }
  };

  // Cache for storing OpenAI translations to reduce API calls
  private static translationCache: Record<string, Record<string, string>> = {
    es: {},
    zh: {},
    fr: {},
    ar: {},
    ru: {}
  };

  /**
   * Translate dynamic content to the target language
   * First tries to use the local dictionary, then falls back to OpenAI for complex translations
   * @param text Source text in English
   * @param targetLanguage Target language code
   * @returns Translated text or a Promise with translated text if using AI
   */
  static translateDynamicContent(text: string, targetLanguage: Language): string | Promise<string> {
    if (targetLanguage === 'en') return text; // No need to translate English to English
    
    // For very short texts or single words, use the dictionary approach
    if (text.length < 30) {
      return this.localDictionaryTranslate(text, targetLanguage);
    }

    // For longer texts or complex sentences, use OpenAI
    return this.aiTranslate(text, targetLanguage);
  }

  /**
   * Translate using the local dictionary 
   * @param text Source text in English
   * @param targetLanguage Target language code 
   * @returns Translated text
   */
  private static localDictionaryTranslate(text: string, targetLanguage: Language): string {
    // Split the text into words/phrases for simple word-by-word translation
    const words = text.split(/\b/);
    
    // Translate each word/phrase if it exists in our dictionary
    const translated = words.map(word => {
      // Remove punctuation for dictionary lookup
      const cleanWord = word.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      
      if (!cleanWord) return word; // Return the original if it's just punctuation or whitespace
      
      // Check if the word (with first letter capitalized for matching) is in our dictionary
      const capitalizedWord = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
      
      if (this.commonPhrases[targetLanguage][capitalizedWord]) {
        // Return the translated word, preserving original case
        if (word === capitalizedWord) {
          return this.commonPhrases[targetLanguage][capitalizedWord];
        } else if (word === cleanWord.toLowerCase()) {
          return this.commonPhrases[targetLanguage][capitalizedWord].toLowerCase();
        } else {
          return this.commonPhrases[targetLanguage][capitalizedWord];
        }
      }
      
      // Return the original word if no translation found
      return word;
    });
    
    return translated.join('');
  }

  /**
   * Translate using OpenAI API
   * @param text Source text in English
   * @param targetLanguage Target language code
   * @returns Promise with translated text
   */
  private static async aiTranslate(text: string, targetLanguage: Language): Promise<string> {
    // Check if we already have this translation in cache
    const cacheKey = `${text}_${targetLanguage}`;
    if (this.translationCache[targetLanguage][cacheKey]) {
      return this.translationCache[targetLanguage][cacheKey];
    }

    try {
      // Use OpenAI Service for translation
      const translatedText = await OpenAIService.translateText(text, targetLanguage);
      
      // Store in cache for future use
      this.translationCache[targetLanguage][cacheKey] = translatedText;
      
      return translatedText;
    } catch (error) {
      console.error("AI translation failed, falling back to dictionary:", error);
      // Fall back to dictionary-based translation on error
      return this.localDictionaryTranslate(text, targetLanguage);
    }
  }
}