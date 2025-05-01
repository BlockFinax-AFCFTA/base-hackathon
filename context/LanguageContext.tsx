import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation, Trans as I18nTrans } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Define available languages - only official African Union languages
export type Language = 'en' | 'fr' | 'ar' | 'pt' | 'es';

// Official languages of the African Union only
export const languageOptions = [
  { code: 'en', name: 'English', flag: '🇺🇸', region: 'African Union Official' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'African Union Official' },
  { code: 'ar', name: 'العربية', flag: '🇪🇬', region: 'African Union Official' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'African Union Official' },
  { code: 'es', name: 'Español', flag: '🇪🇸', region: 'African Union Official' },
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: string) => string;
  translateDynamic: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  translate: () => '',
  translateDynamic: async () => '',
});

interface LanguageProviderProps {
  children: ReactNode;
}

// Default translations for key phrases
const translations: Record<Language, Record<string, string>> = {
  
  en: {
    // General
    'app.title': 'BlockFinaX',
    'app.slogan': 'Secure Trade Finance for Global Commerce',
    'app.welcome': 'Welcome to BlockFinaX',
    
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.contracts': 'Contracts',
    'nav.wallet': 'Wallet',
    'nav.documents': 'Documents',
    'nav.logistics': 'Logistics',
    'nav.tradeFinance': 'Trade Finance',
    'nav.kyc': 'Identity Verification',
    
    // Dashboard
    'dashboard.overview': 'Overview',
    'dashboard.recentTransactions': 'Recent Transactions',
    'dashboard.activeContracts': 'Active Contracts',
    'dashboard.riskAssessment': 'Risk Assessment',
    'dashboard.financial': 'Financial Dashboard',
    'dashboard.risk': 'Risk Intelligence',
    'dashboard.regulatory': 'Regulatory AI',
    'dashboard.logistics': 'Logistics',
    'dashboard.translation': 'Translation Tool',
    'dashboard.lastUpdated': 'Last updated:',
    'dashboard.totalTradeVolume': 'Total Trade Volume',
    'dashboard.globalTradeActivity': 'Global trade activity',
    'dashboard.activeTradeDeals': 'Active Trade Deals',
    'dashboard.currentTransactions': 'Current transactions',
    'dashboard.securedTransactions': 'Secured Transactions',
    'dashboard.smartContractProtected': 'Smart contract protected',
    'dashboard.transactionLedger': 'Transaction Ledger',
    'dashboard.newTransaction': 'New Transaction',
    'dashboard.recentEscrow': 'Recent escrow contract activities and settlements',
    'dashboard.noTransactions': 'No transactions yet',
    'dashboard.transactionHistory': 'Your transaction history will appear here',
    'dashboard.riskAssessmentComing': 'Risk assessment dashboard coming soon',
    'dashboard.analyzeRisk': 'Analyze your trade portfolio risk factors',
    'dashboard.aiTranslation': 'AI-Enhanced Translation System',
    'dashboard.aiTranslationDesc': 'BlockFinaX uses advanced AI translation to break language barriers in international trade',
    'dashboard.aiRegulatoryDesc': 'AI-powered guidance for navigating international trade regulations',
    
    // Contracts
    'contracts.create': 'Create Contract',
    'contracts.status.draft': 'Draft',
    'contracts.status.awaitingFunds': 'Awaiting Funds',
    'contracts.status.funded': 'Funded',
    'contracts.status.goodsShipped': 'Goods Shipped',
    'contracts.status.goodsReceived': 'Goods Received',
    'contracts.status.completed': 'Completed',
    
    // Wallet
    'wallet.balance': 'Balance',
    'wallet.send': 'Send',
    'wallet.receive': 'Receive',
    'wallet.transactions': 'Transactions',
    'wallet.fundEscrow': 'Fund Escrow',
    
    // Documents
    'documents.upload': 'Upload Document',
    'documents.verify': 'Verify Document',
    'documents.share': 'Share Document',
    
    // Logistics
    'logistics.book': 'Book Shipment',
    'logistics.track': 'Track Shipment',
    'logistics.providers': 'Logistics Providers',
    
    // Trade Finance
    'finance.apply': 'Apply for Financing',
    'finance.status': 'Application Status',
    
    // KYC
    'kyc.verify': 'Verify Identity',
    'kyc.status': 'Verification Status',
    
    // Common actions
    'actions.save': 'Save',
    'actions.cancel': 'Cancel',
    'actions.confirm': 'Confirm',
    'actions.edit': 'Edit',
    'actions.delete': 'Delete',
    'actions.view': 'View',
    'actions.search': 'Search',
    'actions.filter': 'Filter',
    'actions.more': 'More',
    'actions.login': 'Login',
    'actions.register': 'Register',
    
    // Language selector
    'language.select': 'Select Language',
    
    // Translation demo
    'translation.demo': 'Translation Demo',
    'translation.testSystem': 'Test the AI-enhanced translation system with your own text',
    'translation.usingAI': 'Using AI Translation (OpenAI)',
    'translation.usingDict': 'Using Dictionary Translation',
    'translation.inputText': 'Input Text',
    'translation.examples': 'Examples',
    'translation.enterEnglish': 'Enter English text to translate',
    'translation.selectLanguage': 'Please select a language other than English to see the translation',
    'translation.withVariables': 'You are currently using {{language}} as your preferred language. There are {{count}} supported languages in the system.',
    'translation.withComponents': 'Click the <bold>highlighted text</bold> or <button>this button</button> to perform an action.',
    
    // Regulatory AI
    'regulatory.description': 'Our Export Regulatory Assistant helps traders navigate the complex landscape of international export regulations by providing guidance tailored to specific products and destinations.',
    'regulatory.documentation': 'Required Documentation',
    'regulatory.documentationDesc': 'Understand what paperwork is needed for your export',
    'regulatory.tariffs': 'Tariffs & Duties',
    'regulatory.tariffsDesc': 'Get insights on applicable tariffs for your goods',
    'regulatory.compliance': 'Compliance Requirements',
    'regulatory.complianceDesc': 'Learn about relevant regulations and standards',
    'regulatory.restrictions': 'Restrictions & Prohibitions',
    'regulatory.restrictionsDesc': 'Identify potential import restrictions at destination',
    'regulatory.accessFull': 'Access Full Regulatory AI Assistant',
  },
  es: {
    // Spanish translations
    'app.title': 'BlockFinaX',
    'app.slogan': 'Financiación Comercial Segura para el Comercio Global',
    'app.welcome': 'Bienvenido a BlockFinaX',
    
    'nav.dashboard': 'Panel',
    'nav.contracts': 'Contratos',
    'nav.wallet': 'Billetera',
    'nav.documents': 'Documentos',
    'nav.logistics': 'Logística',
    'nav.tradeFinance': 'Financiación Comercial',
    'nav.kyc': 'Verificación de Identidad',
    
    'dashboard.overview': 'Resumen',
    'dashboard.recentTransactions': 'Transacciones Recientes',
    'dashboard.activeContracts': 'Contratos Activos',
    'dashboard.riskAssessment': 'Evaluación de Riesgos',
    
    'contracts.create': 'Crear Contrato',
    'contracts.status.draft': 'Borrador',
    'contracts.status.awaitingFunds': 'Esperando Fondos',
    'contracts.status.funded': 'Financiado',
    'contracts.status.goodsShipped': 'Mercancía Enviada',
    'contracts.status.goodsReceived': 'Mercancía Recibida',
    'contracts.status.completed': 'Completado',
    
    'wallet.balance': 'Saldo',
    'wallet.send': 'Enviar',
    'wallet.receive': 'Recibir',
    'wallet.transactions': 'Transacciones',
    'wallet.fundEscrow': 'Fondos en Custodia',
    
    'documents.upload': 'Subir Documento',
    'documents.verify': 'Verificar Documento',
    'documents.share': 'Compartir Documento',
    
    'logistics.book': 'Reservar Envío',
    'logistics.track': 'Seguimiento de Envío',
    'logistics.providers': 'Proveedores Logísticos',
    
    'finance.apply': 'Solicitar Financiación',
    'finance.status': 'Estado de la Solicitud',
    
    'kyc.verify': 'Verificar Identidad',
    'kyc.status': 'Estado de Verificación',
    
    'actions.save': 'Guardar',
    'actions.cancel': 'Cancelar',
    'actions.confirm': 'Confirmar',
    'actions.edit': 'Editar',
    'actions.delete': 'Eliminar',
    'actions.view': 'Ver',
    'actions.search': 'Buscar',
    'actions.filter': 'Filtrar',
    'actions.more': 'Más',
    'actions.login': 'Iniciar Sesión',
    'actions.register': 'Registrarse',
    
    'language.select': 'Seleccionar Idioma',
    
    'translation.demo': 'Demostración de Traducción',
    'translation.withVariables': 'Actualmente estás usando {{language}} como tu idioma preferido. Hay {{count}} idiomas compatibles en el sistema.',
    'translation.withComponents': 'Haz clic en el <bold>texto resaltado</bold> o <button>este botón</button> para realizar una acción.',
  },
  pt: {
    // Portuguese translations
    'app.title': 'BlockFinaX',
    'app.slogan': 'Financiamento Comercial Seguro para o Comércio Global',
    'app.welcome': 'Bem-vindo ao BlockFinaX',
    
    'nav.dashboard': 'Painel',
    'nav.contracts': 'Contratos',
    'nav.wallet': 'Carteira',
    'nav.documents': 'Documentos',
    'nav.logistics': 'Logística',
    'nav.tradeFinance': 'Financiamento Comercial',
    'nav.kyc': 'Verificação de Identidade',
    
    'dashboard.overview': 'Visão Geral',
    'dashboard.recentTransactions': 'Transações Recentes',
    'dashboard.activeContracts': 'Contratos Ativos',
    'dashboard.riskAssessment': 'Avaliação de Risco',
    'dashboard.aiTranslationDesc': 'BlockFinaX usa tradução avançada por IA para quebrar barreiras linguísticas no comércio internacional',
    
    'contracts.create': 'Criar Contrato',
    'contracts.status.draft': 'Rascunho',
    'contracts.status.awaitingFunds': 'Aguardando Fundos',
    'contracts.status.funded': 'Financiado',
    'contracts.status.goodsShipped': 'Mercadorias Enviadas',
    'contracts.status.goodsReceived': 'Mercadorias Recebidas',
    'contracts.status.completed': 'Concluído',
    
    'wallet.balance': 'Saldo',
    'wallet.send': 'Enviar',
    'wallet.receive': 'Receber',
    'wallet.transactions': 'Transações',
    'wallet.fundEscrow': 'Fundos em Custódia',
    
    'documents.upload': 'Carregar Documento',
    'documents.verify': 'Verificar Documento',
    'documents.share': 'Compartilhar Documento',
    
    'logistics.book': 'Reservar Envio',
    'logistics.track': 'Rastrear Envio',
    'logistics.providers': 'Provedores de Logística',
    
    'finance.apply': 'Solicitar Financiamento',
    'finance.status': 'Status da Solicitação',
    
    'kyc.verify': 'Verificar Identidade',
    'kyc.status': 'Status de Verificação',
    
    'actions.save': 'Salvar',
    'actions.cancel': 'Cancelar',
    'actions.confirm': 'Confirmar',
    'actions.edit': 'Editar',
    'actions.delete': 'Excluir',
    'actions.view': 'Visualizar',
    'actions.search': 'Pesquisar',
    'actions.filter': 'Filtrar',
    'actions.more': 'Mais',
    'actions.login': 'Entrar',
    'actions.register': 'Registrar',
    
    'language.select': 'Selecionar Idioma',
    
    'translation.demo': 'Demonstração de Tradução',
    'translation.withVariables': 'Você está usando {{language}} como seu idioma preferido. Existem {{count}} idiomas suportados no sistema.',
    'translation.withComponents': 'Clique no <bold>texto destacado</bold> ou <button>este botão</button> para realizar uma ação.',
  },
  fr: {
    // French translations
    'app.title': 'BlockFinaX',
    'app.slogan': 'Financement Commercial Sécurisé pour le Commerce Mondial',
    'app.welcome': 'Bienvenue sur BlockFinaX',
    
    'nav.dashboard': 'Tableau de Bord',
    'nav.contracts': 'Contrats',
    'nav.wallet': 'Portefeuille',
    'nav.documents': 'Documents',
    'nav.logistics': 'Logistique',
    'nav.tradeFinance': 'Financement Commercial',
    'nav.kyc': 'Vérification d\'Identité',
    
    'dashboard.overview': 'Aperçu',
    'dashboard.recentTransactions': 'Transactions Récentes',
    'dashboard.activeContracts': 'Contrats Actifs',
    'dashboard.riskAssessment': 'Évaluation des Risques',
    'dashboard.aiTranslationDesc': 'BlockFinaX utilise la traduction avancée par IA pour éliminer les barrières linguistiques dans le commerce international',
    
    'contracts.create': 'Créer un Contrat',
    'contracts.status.draft': 'Brouillon',
    'contracts.status.awaitingFunds': 'En Attente de Fonds',
    'contracts.status.funded': 'Financé',
    'contracts.status.goodsShipped': 'Marchandises Expédiées',
    'contracts.status.goodsReceived': 'Marchandises Reçues',
    'contracts.status.completed': 'Terminé',
    
    'wallet.balance': 'Solde',
    'wallet.send': 'Envoyer',
    'wallet.receive': 'Recevoir',
    'wallet.transactions': 'Transactions',
    'wallet.fundEscrow': 'Fonds Sous Séquestre',
    
    'documents.upload': 'Télécharger un Document',
    'documents.verify': 'Vérifier un Document',
    'documents.share': 'Partager un Document',
    
    'logistics.book': 'Réserver une Expédition',
    'logistics.track': 'Suivre une Expédition',
    'logistics.providers': 'Prestataires Logistiques',
    
    'finance.apply': 'Demander un Financement',
    'finance.status': 'Statut de la Demande',
    
    'kyc.verify': 'Vérifier l\'Identité',
    'kyc.status': 'Statut de Vérification',
    
    'actions.save': 'Enregistrer',
    'actions.cancel': 'Annuler',
    'actions.confirm': 'Confirmer',
    'actions.edit': 'Modifier',
    'actions.delete': 'Supprimer',
    'actions.view': 'Voir',
    'actions.search': 'Rechercher',
    'actions.filter': 'Filtrer',
    'actions.more': 'Plus',
    'actions.login': 'Se Connecter',
    'actions.register': 'S\'inscrire',
    
    'language.select': 'Sélectionner la Langue',
    
    'translation.demo': 'Démo de Traduction',
    'translation.withVariables': 'Vous utilisez actuellement {{language}} comme langue préférée. Il y a {{count}} langues prises en charge dans le système.',
    'translation.withComponents': 'Cliquez sur le <bold>texte en gras</bold> ou <button>ce bouton</button> pour effectuer une action.',
  },
  ar: {
    // Arabic translations
    'app.title': 'BlockFinaX',
    'app.slogan': 'تمويل تجاري آمن للتجارة العالمية',
    'app.welcome': 'مرحبًا بك في BlockFinaX',
    
    'nav.dashboard': 'لوحة التحكم',
    'nav.contracts': 'العقود',
    'nav.wallet': 'المحفظة',
    'nav.documents': 'المستندات',
    'nav.logistics': 'الخدمات اللوجستية',
    'nav.tradeFinance': 'التمويل التجاري',
    'nav.kyc': 'التحقق من الهوية',
    
    'dashboard.overview': 'نظرة عامة',
    'dashboard.recentTransactions': 'المعاملات الأخيرة',
    'dashboard.activeContracts': 'العقود النشطة',
    'dashboard.riskAssessment': 'تقييم المخاطر',
    'dashboard.aiTranslationDesc': 'يستخدم BlockFinaX الترجمة المتقدمة بالذكاء الاصطناعي لكسر حواجز اللغة في التجارة الدولية',
    
    'contracts.create': 'إنشاء عقد',
    'contracts.status.draft': 'مسودة',
    'contracts.status.awaitingFunds': 'في انتظار التمويل',
    'contracts.status.funded': 'ممول',
    'contracts.status.goodsShipped': 'تم شحن البضائع',
    'contracts.status.goodsReceived': 'تم استلام البضائع',
    'contracts.status.completed': 'مكتمل',
    
    'wallet.balance': 'الرصيد',
    'wallet.send': 'إرسال',
    'wallet.receive': 'استلام',
    'wallet.transactions': 'المعاملات',
    'wallet.fundEscrow': 'تمويل الضمان',
    
    'documents.upload': 'تحميل مستند',
    'documents.verify': 'التحقق من المستند',
    'documents.share': 'مشاركة المستند',
    
    'logistics.book': 'حجز شحنة',
    'logistics.track': 'تتبع الشحنة',
    'logistics.providers': 'مزودو الخدمات اللوجستية',
    
    'finance.apply': 'طلب تمويل',
    'finance.status': 'حالة الطلب',
    
    'kyc.verify': 'التحقق من الهوية',
    'kyc.status': 'حالة التحقق',
    
    'actions.save': 'حفظ',
    'actions.cancel': 'إلغاء',
    'actions.confirm': 'تأكيد',
    'actions.edit': 'تعديل',
    'actions.delete': 'حذف',
    'actions.view': 'عرض',
    'actions.search': 'بحث',
    'actions.filter': 'تصفية',
    'actions.more': 'المزيد',
    'actions.login': 'تسجيل الدخول',
    'actions.register': 'التسجيل',
    
    'language.select': 'اختر اللغة',
    
    'translation.demo': 'عرض توضيحي للترجمة',
    'translation.withVariables': 'أنت تستخدم حاليًا {{language}} كلغتك المفضلة. هناك {{count}} لغات مدعومة في النظام.',
    'translation.withComponents': 'انقر على <bold>النص المميز</bold> أو <button>هذا الزر</button> لتنفيذ إجراء.',
  },

};

// Initialize i18next
i18next
  .use(initReactI18next) // passes i18next down to react-i18next
  .use(LanguageDetector) // detects user language
  .init({
    resources: {
      en: { translation: translations.en },
      fr: { translation: translations.fr },
      ar: { translation: translations.ar },
      pt: { translation: translations.pt },
      es: { translation: translations.es }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { t } = useTranslation();
  const [language, setLanguageState] = useState<Language>('en');

  // Create a wrapped setLanguage function that also updates i18next
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18next.changeLanguage(lang);
  };

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    } else {
      // Use the language detected by i18next if no saved preference
      const detectedLang = i18next.language.split('-')[0] as Language; 
      if (languageOptions.some(option => option.code === detectedLang)) {
        setLanguage(detectedLang);
      }
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to get translation for a key using i18next
  const translate = (key: string): string => {
    // Use i18next's t function, which will handle fallbacks automatically
    return t(key) || key;
  };

  // Function to translate dynamic content using our local translation service
  const translateDynamic = async (text: string): Promise<string> => {
    if (language === 'en') return text; // No need to translate if already in English
    
    try {
      // Import the translation service dynamically to avoid circular dependencies
      const { TranslationService } = await import('../services/translationService');
      
      // Use our local translation service
      return TranslationService.translateDynamicContent(text, language);
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text on error
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, translateDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Create a simple Trans component for complex translations with variables
interface I18nTransProps {
  i18nKey: string;
  values?: Record<string, string | number>;
  components?: Record<string, React.ReactNode>;
}

export const Trans: React.FC<I18nTransProps> = ({ i18nKey, values, components }) => {
  const { t } = useTranslation();
  
  // Simple approach - just use the translated string directly
  // We'll handle component replacement in a simpler way
  const translatedText = t(i18nKey, values || {});
  
  // If there are no components, return the translated text directly
  if (!components) {
    return <>{translatedText}</>;
  }
  
  try {
    // When components are present, use I18nTrans directly but with a workaround
    // This will return the unformatted translation string if there's an issue
    return <I18nTrans t={t} i18nKey={i18nKey} values={values}>{translatedText}</I18nTrans>;
  } catch (error) {
    console.error("Error in Trans component:", error);
    return <>{translatedText}</>;
  }
};

// Re-export i18next 
export { i18next };

export default LanguageContext;