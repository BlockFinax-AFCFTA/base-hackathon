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
    'nav.invoices': 'Invoices',
    
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
    'dashboard.contractPortfolio': 'Contract Portfolio Status',
    'dashboard.assetDistribution': 'Asset distribution by contract status',
    'dashboard.draft': 'Draft',
    'dashboard.pendingFinalization': 'Pending finalization',
    'dashboard.escrowRequired': 'Escrow Required',
    'dashboard.awaitingDeposit': 'Awaiting deposit',
    'dashboard.active': 'Active',
    'dashboard.inTransitAssets': 'In-transit assets',
    'dashboard.completed': 'Completed',
    'dashboard.settledTransactions': 'Settled transactions',
    'dashboard.financialActions': 'Financial Actions',
    'dashboard.executeTradeOps': 'Execute trade operations',
    'dashboard.newTradeContract': 'New Trade Contract',
    'dashboard.initiateEscrow': 'Initiate escrow transaction',
    'dashboard.secureDocuments': 'Secure Documents',
    'dashboard.uploadVerification': 'Upload verification files',
    'dashboard.releasePayment': 'Release Payment',
    'dashboard.confirmSettle': 'Confirm & settle transaction',
    'dashboard.viewRiskDashboard': 'View Risk Dashboard',
    'dashboard.viewPredictive': 'View predictive insights',
    'dashboard.tradeRiskAssessment': 'Trade Risk Assessment',
    'dashboard.riskAnalysisNotice': 'AI-powered risk analysis has identified potential issues in your trade portfolio that require attention.',
    'dashboard.riskAnalysisDetails': 'AI-powered risk analysis has identified 3 potential issues in your trade portfolio that require attention. These include geopolitical factors, payment reliability concerns, and shipping logistics vulnerabilities.',
    'dashboard.financialDashboard': 'Financial Dashboard',
    'dashboard.riskIntelligence': 'Risk Intelligence',
    'dashboard.regulatoryAI': 'Regulatory AI',
    'dashboard.marketplace': 'Marketplace',
    
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
    'wallet.mainWallet': 'Main Wallet',
    'wallet.escrowWallet': 'Escrow Wallet',
    'wallet.title': 'Wallet',
    'wallet.subtitle': 'Manage your funds and transactions',
    'wallet.deposit': 'Deposit',
    'wallet.withdraw': 'Withdraw',
    'wallet.transfer': 'Transfer',
    'wallet.escrowWallets': 'Escrow Wallets',
    'wallet.noTransactions': 'No transactions',
    'wallet.noTransactionsDesc': 'You haven\'t made any transactions yet.',
    'wallet.transactionHistory': 'Transaction History',
    'wallet.recentActivity': 'Your recent wallet activity',
    'wallet.primaryWallet': 'Your primary wallet for transactions',
    'wallet.escrowForContract': 'Escrow wallet for contract #{{contractId}}',
    'wallet.walletId': 'Wallet ID:',
    'wallet.depositFunds': 'Deposit Funds',
    'wallet.depositDesc': 'Add funds to your wallet.',
    'wallet.withdrawFunds': 'Withdraw Funds',
    'wallet.withdrawDesc': 'Withdraw funds from your wallet.',
    'wallet.transferFunds': 'Transfer Funds',
    'wallet.transferDesc': 'Transfer funds to another wallet.',
    'wallet.amount': 'Amount',
    'wallet.description': 'Description (Optional)',
    'wallet.descriptionPlaceholder': 'Payment for services...',
    'wallet.destinationWallet': 'Destination Wallet',
    'wallet.selectDestination': 'Select destination wallet',
    'wallet.maxAmount': 'Max amount:',
    
    // Documents
    'documents.upload': 'Upload Document',
    'documents.verify': 'Verify Document',
    'documents.share': 'Share Document',
    'documents.title': 'Documents',
    'documents.logistics': 'Logistics',
    'documents.yourDocuments': 'Your Documents',
    'documents.uploadDocument': 'Upload Document',
    'documents.backToDocuments': 'Back to Documents',
    'documents.viewAllDocuments': 'View All Documents',
    'documents.documentDetails': 'Document Details',
    'documents.searchDocuments': 'Search documents...',
    'documents.redirecting': 'Redirecting to Documents & Logistics...',
    'documents.noDocuments': 'No documents found',
    'documents.uploadNew': 'Upload a new document to get started',
    
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
    'regulatory.title': 'Export Regulatory Assistant',
    'regulatory.viewTool': 'View Full Tool',
    'regulatory.quickGuidance': 'Get quick regulatory guidance for exporting your products',
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
    'regulatory.product': 'Product',
    'regulatory.productPlaceholder': 'e.g. Medical Equipment, Coffee Beans',
    'regulatory.origin': 'Origin',
    'regulatory.destination': 'Destination',
    'regulatory.category': 'Category',
    'regulatory.selectCountry': 'Select country',
    'regulatory.selectCategory': 'Select category',
    'regulatory.analyze': 'Analyze Export Requirements',
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
    'nav.invoices': 'Facturas',
    
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
    'wallet.mainWallet': 'Billetera Principal',
    'wallet.escrowWallet': 'Billetera de Custodia',
    'wallet.title': 'Billetera',
    'wallet.subtitle': 'Administra tus fondos y transacciones',
    'wallet.deposit': 'Depositar',
    'wallet.withdraw': 'Retirar',
    'wallet.transfer': 'Transferir',
    'wallet.escrowWallets': 'Billeteras de Custodia',
    'wallet.noTransactions': 'Sin transacciones',
    'wallet.noTransactionsDesc': 'Aún no has realizado ninguna transacción.',
    'wallet.transactionHistory': 'Historial de Transacciones',
    'wallet.recentActivity': 'Tu actividad reciente de billetera',
    'wallet.primaryWallet': 'Tu billetera principal para transacciones',
    'wallet.escrowForContract': 'Billetera de custodia para contrato #{{contractId}}',
    'wallet.walletId': 'ID de Billetera:',
    'wallet.depositFunds': 'Depositar Fondos',
    'wallet.depositDesc': 'Añadir fondos a tu billetera.',
    'wallet.withdrawFunds': 'Retirar Fondos',
    'wallet.withdrawDesc': 'Retirar fondos de tu billetera.',
    'wallet.transferFunds': 'Transferir Fondos',
    'wallet.transferDesc': 'Transferir fondos a otra billetera.',
    'wallet.amount': 'Cantidad',
    'wallet.description': 'Descripción (Opcional)',
    'wallet.descriptionPlaceholder': 'Pago por servicios...',
    'wallet.destinationWallet': 'Billetera de Destino',
    'wallet.selectDestination': 'Seleccionar billetera de destino',
    'wallet.maxAmount': 'Cantidad máxima:',
    
    'documents.upload': 'Subir Documento',
    'documents.verify': 'Verificar Documento',
    'documents.share': 'Compartir Documento',
    'documents.title': 'Documentos',
    'documents.logistics': 'Logística',
    'documents.yourDocuments': 'Tus Documentos',
    'documents.uploadDocument': 'Subir Documento',
    'documents.backToDocuments': 'Volver a Documentos',
    'documents.viewAllDocuments': 'Ver Todos los Documentos',
    'documents.documentDetails': 'Detalles del Documento',
    'documents.searchDocuments': 'Buscar documentos...',
    'documents.redirecting': 'Redirigiendo a Documentos y Logística...',
    'documents.noDocuments': 'No se encontraron documentos',
    'documents.uploadNew': 'Sube un nuevo documento para comenzar',
    
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
    'translation.testSystem': 'Prueba el sistema de traducción mejorado con IA con tu propio texto',
    'translation.selectLanguage': 'Por favor selecciona un idioma diferente al inglés para ver la traducción',
    'translation.withVariables': 'Actualmente estás usando {{language}} como tu idioma preferido. Hay {{count}} idiomas compatibles en el sistema.',
    'translation.withComponents': 'Haz clic en el <bold>texto resaltado</bold> o <button>este botón</button> para realizar una acción.',
    
    // Dashboard tabs
    'dashboard.financial': 'Panel Financiero',
    'dashboard.risk': 'Inteligencia de Riesgo',
    'dashboard.regulatory': 'IA Regulatoria',
    'dashboard.marketplace': 'Mercado',
    'dashboard.financialDashboard': 'Panel Financiero',
    'dashboard.riskIntelligence': 'Inteligencia de Riesgo',
    'dashboard.regulatoryAI': 'IA Regulatoria',
    'dashboard.tradeRiskAssessment': 'Evaluación de Riesgo Comercial',
    'dashboard.riskAnalysisDetails': 'El análisis de riesgo impulsado por IA ha identificado 3 problemas potenciales en su cartera comercial que requieren atención. Estos incluyen factores geopolíticos, preocupaciones sobre la fiabilidad de los pagos y vulnerabilidades logísticas de envío.',
    'dashboard.viewRiskDashboard': 'Ver Panel de Riesgo',
    'dashboard.translation': 'Herramienta de Traducción',
    'dashboard.logistics': 'Logística',
    'dashboard.aiTranslation': 'Sistema de Traducción Mejorado por IA',
    'dashboard.aiRegulatoryDesc': 'Orientación impulsada por IA para navegar por las regulaciones comerciales internacionales',
    
    // Regulatory AI
    'regulatory.title': 'Asistente Regulatorio de Exportación',
    'regulatory.viewTool': 'Ver Herramienta Completa',
    'regulatory.quickGuidance': 'Obtén orientación regulatoria rápida para exportar tus productos',
    'regulatory.description': 'Nuestro Asistente Regulatorio de Exportación ayuda a los comerciantes a navegar por el complejo panorama de las regulaciones de exportación internacionales proporcionando orientación adaptada a productos y destinos específicos.',
    'regulatory.documentation': 'Documentación Requerida',
    'regulatory.documentationDesc': 'Entiende qué documentación se necesita para tu exportación',
    'regulatory.tariffs': 'Aranceles e Impuestos',
    'regulatory.tariffsDesc': 'Obtén información sobre aranceles aplicables a tus mercancías',
    'regulatory.compliance': 'Requisitos de Cumplimiento',
    'regulatory.complianceDesc': 'Aprende sobre regulaciones y estándares relevantes',
    'regulatory.restrictions': 'Restricciones y Prohibiciones',
    'regulatory.restrictionsDesc': 'Identifica posibles restricciones de importación en el destino',
    'regulatory.accessFull': 'Acceder al Asistente Completo de IA Regulatoria',
    'regulatory.product': 'Producto',
    'regulatory.productPlaceholder': 'ej. Equipo Médico, Granos de Café',
    'regulatory.origin': 'Origen',
    'regulatory.destination': 'Destino',
    'regulatory.category': 'Categoría',
    'regulatory.selectCountry': 'Seleccionar país',
    'regulatory.selectCategory': 'Seleccionar categoría',
    'regulatory.analyze': 'Analizar Requisitos de Exportación',
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
    'nav.invoices': 'Faturas',
    
    'dashboard.overview': 'Visão Geral',
    'dashboard.recentTransactions': 'Transações Recentes',
    'dashboard.activeContracts': 'Contratos Ativos',
    'dashboard.riskAssessment': 'Avaliação de Risco',
    'dashboard.aiTranslationDesc': 'BlockFinaX usa tradução avançada por IA para quebrar barreiras linguísticas no comércio internacional',
    'dashboard.riskAnalysisDetails': 'A análise de risco baseada em IA identificou 3 problemas potenciais em seu portfólio de negócios que requerem atenção. Estes incluem fatores geopolíticos, preocupações com a confiabilidade de pagamentos e vulnerabilidades na logística de envio.',
    'dashboard.marketplace': 'Mercado',
    'dashboard.financialDashboard': 'Painel Financeiro',
    'dashboard.riskIntelligence': 'Inteligência de Risco',
    'dashboard.regulatoryAI': 'IA Regulatória',
    'dashboard.tradeRiskAssessment': 'Avaliação de Risco Comercial',
    'dashboard.viewRiskDashboard': 'Ver Painel de Risco',
    
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
    'nav.invoices': 'Factures',
    
    'dashboard.overview': 'Aperçu',
    'dashboard.recentTransactions': 'Transactions Récentes',
    'dashboard.activeContracts': 'Contrats Actifs',
    'dashboard.riskAssessment': 'Évaluation des Risques',
    'dashboard.aiTranslationDesc': 'BlockFinaX utilise la traduction avancée par IA pour éliminer les barrières linguistiques dans le commerce international',
    'dashboard.riskAnalysisDetails': "L'analyse de risque alimentée par l'IA a identifié 3 problèmes potentiels dans votre portefeuille commercial qui nécessitent une attention. Ceux-ci incluent des facteurs géopolitiques, des préoccupations de fiabilité de paiement et des vulnérabilités logistiques d'expédition.",
    'dashboard.marketplace': 'Marché',
    'dashboard.financialDashboard': 'Tableau de Bord Financier',
    'dashboard.riskIntelligence': 'Intelligence des Risques',
    'dashboard.regulatoryAI': 'IA Réglementaire',
    'dashboard.tradeRiskAssessment': 'Évaluation des Risques Commerciaux',
    'dashboard.viewRiskDashboard': 'Voir le Tableau de Bord des Risques',
    
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
    'nav.invoices': 'الفواتير',
    
    'dashboard.overview': 'نظرة عامة',
    'dashboard.recentTransactions': 'المعاملات الأخيرة',
    'dashboard.activeContracts': 'العقود النشطة',
    'dashboard.riskAssessment': 'تقييم المخاطر',
    'dashboard.aiTranslationDesc': 'يستخدم BlockFinaX الترجمة المتقدمة بالذكاء الاصطناعي لكسر حواجز اللغة في التجارة الدولية',
    'dashboard.riskAnalysisDetails': 'حدد تحليل المخاطر المدعوم بالذكاء الاصطناعي 3 مشاكل محتملة في محفظة التجارة الخاصة بك تتطلب الاهتمام. وتشمل هذه العوامل الجيوسياسية، ومخاوف موثوقية الدفع، ونقاط ضعف الخدمات اللوجستية للشحن.',
    'dashboard.marketplace': 'السوق',
    'dashboard.financialDashboard': 'لوحة المعلومات المالية',
    'dashboard.riskIntelligence': 'استخبارات المخاطر',
    'dashboard.regulatoryAI': 'الذكاء الاصطناعي التنظيمي',
    'dashboard.tradeRiskAssessment': 'تقييم مخاطر التجارة',
    'dashboard.viewRiskDashboard': 'عرض لوحة معلومات المخاطر',
    
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

// Import structured translations from our namespaces
import { translationResources } from '../translations';

// Initialize i18next
i18next
  .use(initReactI18next) // passes i18next down to react-i18next
  .use(LanguageDetector) // detects user language
  .init({
    resources: {
      en: { 
        translation: translations.en,
        contracts: translationResources.en.contracts,
        documents: translationResources.en.documents,
        invoices: translationResources.en.invoices,
        wallet: translationResources.en.wallet,
        logistics: translationResources.en.logistics,
        kyc: translationResources.en.kyc,
        regulatory: translationResources.en.regulatory,
      },
      fr: { 
        translation: translations.fr,
        contracts: translationResources.fr.contracts,
        documents: translationResources.fr.documents,
        invoices: translationResources.fr.invoices,
        wallet: translationResources.fr.wallet,
        logistics: translationResources.fr.logistics,
        kyc: translationResources.fr.kyc,
        regulatory: translationResources.fr.regulatory,
      },
      ar: { 
        translation: translations.ar,
        contracts: translationResources.ar.contracts,
        documents: translationResources.ar.documents,
        invoices: translationResources.ar.invoices,
        wallet: translationResources.ar.wallet,
        logistics: translationResources.ar.logistics,
        kyc: translationResources.ar.kyc,
        regulatory: translationResources.ar.regulatory,
      },
      pt: { 
        translation: translations.pt,
        contracts: translationResources.pt.contracts,
        documents: translationResources.pt.documents,
        invoices: translationResources.pt.invoices,
        wallet: translationResources.pt.wallet,
        logistics: translationResources.pt.logistics,
        kyc: translationResources.pt.kyc,
        regulatory: translationResources.pt.regulatory,
      },
      es: { 
        translation: translations.es,
        contracts: translationResources.es.contracts,
        documents: translationResources.es.documents,
        invoices: translationResources.es.invoices,
        wallet: translationResources.es.wallet,
        logistics: translationResources.es.logistics,
        kyc: translationResources.es.kyc,
        regulatory: translationResources.es.regulatory,
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    ns: ['translation', 'contracts', 'documents', 'invoices', 'wallet', 'logistics', 'kyc', 'regulatory'],
    defaultNS: 'translation'
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