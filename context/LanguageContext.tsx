import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define available languages
export type Language = 'en' | 'es' | 'zh' | 'fr' | 'ar' | 'ru' | 'sw' | 'am' | 'ha' | 'yo' | 'ig' | 'zu' | 'xh' | 'st' | 'mg';

// Languages include major African Union languages
export const languageOptions = [
  // Global languages
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇪🇬' },
  
  // African Union languages
  { code: 'sw', name: 'Kiswahili', flag: '🇹🇿' },   // Tanzania/Kenya/East Africa
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },        // Amharic - Ethiopia
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },       // Nigeria/Niger/Ghana
  { code: 'yo', name: 'Yorùbá', flag: '🇳🇬' },      // Nigeria/Benin
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },        // Nigeria
  { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },     // South Africa
  { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },    // South Africa
  { code: 'st', name: 'Sesotho', flag: '🇱🇸' },     // Lesotho/South Africa
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },    // Madagascar
  
  // Other global languages
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
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
  // New African languages
  sw: {
    // Swahili translations
    'app.title': 'BlockFinaX',
    'app.slogan': 'Fedha za Biashara Salama kwa Biashara ya Kimataifa',
    'app.welcome': 'Karibu kwenye BlockFinaX',
    
    'nav.dashboard': 'Dashibodi',
    'nav.contracts': 'Mikataba',
    'nav.wallet': 'Pochi',
    'nav.documents': 'Nyaraka',
    'nav.logistics': 'Usafirishaji',
    'nav.tradeFinance': 'Ufadhili wa Biashara',
    'nav.kyc': 'Uthibitishaji wa Utambulisho',
    
    'dashboard.overview': 'Muhtasari',
    'dashboard.recentTransactions': 'Miamala ya Hivi Karibuni',
    'dashboard.activeContracts': 'Mikataba Inayoendelea',
    'dashboard.riskAssessment': 'Tathmini ya Hatari',

    'language.select': 'Chagua Lugha',
  },
  
  // Add minimal translations for other African languages (placeholders)
  am: { 
    'app.title': 'BlockFinaX',
    'language.select': 'ቋንቋ ይምረጡ' 
  }, // Amharic
  ha: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Zaɓi Harshe' 
  }, // Hausa
  yo: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Yan Èdè' 
  }, // Yoruba
  ig: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Họrọ Asụsụ' 
  }, // Igbo
  zu: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Khetha Ulimi' 
  }, // Zulu
  xh: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Khetha Ulwimi' 
  }, // Xhosa
  st: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Kgetha Puo' 
  }, // Sesotho
  mg: { 
    'app.title': 'BlockFinaX',
    'language.select': 'Fidio fiteny' 
  }, // Malagasy
  
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
  },
  zh: {
    // Chinese translations
    'app.title': 'BlockFinaX',
    'app.slogan': '为全球贸易提供安全贸易融资',
    'app.welcome': '欢迎使用BlockFinaX',
    
    'nav.dashboard': '仪表板',
    'nav.contracts': '合同',
    'nav.wallet': '钱包',
    'nav.documents': '文档',
    'nav.logistics': '物流',
    'nav.tradeFinance': '贸易融资',
    'nav.kyc': '身份验证',
    
    'dashboard.overview': '概览',
    'dashboard.recentTransactions': '最近交易',
    'dashboard.activeContracts': '活跃合同',
    'dashboard.riskAssessment': '风险评估',
    
    'contracts.create': '创建合同',
    'contracts.status.draft': '草稿',
    'contracts.status.awaitingFunds': '等待资金',
    'contracts.status.funded': '已注资',
    'contracts.status.goodsShipped': '商品已发货',
    'contracts.status.goodsReceived': '商品已收到',
    'contracts.status.completed': '已完成',
    
    'wallet.balance': '余额',
    'wallet.send': '发送',
    'wallet.receive': '接收',
    'wallet.transactions': '交易',
    'wallet.fundEscrow': '托管资金',
    
    'documents.upload': '上传文档',
    'documents.verify': '验证文档',
    'documents.share': '分享文档',
    
    'logistics.book': '预订运输',
    'logistics.track': '追踪运输',
    'logistics.providers': '物流提供商',
    
    'finance.apply': '申请融资',
    'finance.status': '申请状态',
    
    'kyc.verify': '验证身份',
    'kyc.status': '验证状态',
    
    'actions.save': '保存',
    'actions.cancel': '取消',
    'actions.confirm': '确认',
    'actions.edit': '编辑',
    'actions.delete': '删除',
    'actions.view': '查看',
    'actions.search': '搜索',
    'actions.filter': '筛选',
    'actions.more': '更多',
    'actions.login': '登录',
    'actions.register': '注册',
    
    'language.select': '选择语言',
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
  },
  ru: {
    // Russian translations
    'app.title': 'BlockFinaX',
    'app.slogan': 'Безопасное Торговое Финансирование для Мировой Торговли',
    'app.welcome': 'Добро пожаловать в BlockFinaX',
    
    'nav.dashboard': 'Панель Управления',
    'nav.contracts': 'Контракты',
    'nav.wallet': 'Кошелек',
    'nav.documents': 'Документы',
    'nav.logistics': 'Логистика',
    'nav.tradeFinance': 'Торговое Финансирование',
    'nav.kyc': 'Верификация Личности',
    
    'dashboard.overview': 'Обзор',
    'dashboard.recentTransactions': 'Последние Транзакции',
    'dashboard.activeContracts': 'Активные Контракты',
    'dashboard.riskAssessment': 'Оценка Рисков',
    
    'contracts.create': 'Создать Контракт',
    'contracts.status.draft': 'Черновик',
    'contracts.status.awaitingFunds': 'Ожидание Средств',
    'contracts.status.funded': 'Финансировано',
    'contracts.status.goodsShipped': 'Товары Отправлены',
    'contracts.status.goodsReceived': 'Товары Получены',
    'contracts.status.completed': 'Завершено',
    
    'wallet.balance': 'Баланс',
    'wallet.send': 'Отправить',
    'wallet.receive': 'Получить',
    'wallet.transactions': 'Транзакции',
    'wallet.fundEscrow': 'Финансировать Депозит',
    
    'documents.upload': 'Загрузить Документ',
    'documents.verify': 'Проверить Документ',
    'documents.share': 'Поделиться Документом',
    
    'logistics.book': 'Заказать Перевозку',
    'logistics.track': 'Отследить Перевозку',
    'logistics.providers': 'Логистические Провайдеры',
    
    'finance.apply': 'Подать Заявку на Финансирование',
    'finance.status': 'Статус Заявки',
    
    'kyc.verify': 'Проверить Личность',
    'kyc.status': 'Статус Проверки',
    
    'actions.save': 'Сохранить',
    'actions.cancel': 'Отменить',
    'actions.confirm': 'Подтвердить',
    'actions.edit': 'Редактировать',
    'actions.delete': 'Удалить',
    'actions.view': 'Просмотр',
    'actions.search': 'Поиск',
    'actions.filter': 'Фильтр',
    'actions.more': 'Еще',
    'actions.login': 'Войти',
    'actions.register': 'Регистрация',
    
    'language.select': 'Выбрать Язык',
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to get translation for a key
  const translate = (key: string): string => {
    // Try to find the key in the current language
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    
    // Fallback to English if the key doesn't exist in current language
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    
    // Return the key itself if no translation found
    return key;
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

export default LanguageContext;