import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Document Types
      'documentType.billOfLading': 'Bill of Lading',
      'documentType.letterOfCredit': 'Letter of Credit',
      'documentType.certificateOfOrigin': 'Certificate of Origin',
      'documentType.phytosanitary': 'Phytosanitary Certificate',
      'documentType.commercialInvoice': 'Commercial Invoice',
      'documentType.packingList': 'Packing List',
      'documentType.insuranceCertificate': 'Insurance Certificate',
      'documentType.document': 'Document',
      
      // Common Document Fields
      'document.date': 'Date',
      'document.referenceNumber': 'Reference Number',
      'document.shipper': 'Shipper/Exporter',
      'document.consignee': 'Consignee',
      'document.notifyParty': 'Notify Party',
      'document.vessel': 'Vessel/Voyage',
      'document.portOfLoading': 'Port of Loading',
      'document.portOfDischarge': 'Port of Discharge',
      'document.description': 'Description of Goods',
      'document.grossWeight': 'Gross Weight',
      'document.measurement': 'Measurement',
      'document.marksAndNumbers': 'Marks & Numbers',
      'document.containerNo': 'Container No.',
      'document.sealNo': 'Seal No.',
      
      // Bill of Lading specific
      'billOfLading.freight': 'Freight Charges',
      'billOfLading.prepaid': 'Prepaid',
      'billOfLading.collect': 'Collect',
      'billOfLading.originalBL': 'Original Bill of Lading',
      'billOfLading.declaredValue': 'Declared Value',
      
      // Certificate of Origin specific
      'certificateOfOrigin.producer': 'Producer',
      'certificateOfOrigin.countryOfOrigin': 'Country of Origin',
      'certificateOfOrigin.countryOfDestination': 'Country of Destination',
      'certificateOfOrigin.declaration': 'Declaration by the Exporter',
      'certificateOfOrigin.certification': 'Certification',
      'certificateOfOrigin.issuingAuthority': 'Issuing Authority',
      
      // Letter of Credit specific
      'letterOfCredit.issuer': 'Issuing Bank',
      'letterOfCredit.applicant': 'Applicant',
      'letterOfCredit.beneficiary': 'Beneficiary',
      'letterOfCredit.amount': 'Amount',
      'letterOfCredit.expiryDate': 'Expiry Date',
      'letterOfCredit.partial': 'Partial Shipments',
      'letterOfCredit.transhipment': 'Transhipment',
      'letterOfCredit.loading': 'Loading',
      'letterOfCredit.discharge': 'Discharge',
      'letterOfCredit.documentsRequired': 'Documents Required',
      'letterOfCredit.specialConditions': 'Special Conditions',
      
      // Phytosanitary specific
      'phytosanitary.plantProtection': 'Plant Protection Organization',
      'phytosanitary.botanicalName': 'Botanical Name of Plants',
      'phytosanitary.treatment': 'Disinfestation and/or Disinfection Treatment',
      'phytosanitary.additionalDeclaration': 'Additional Declaration',
      
      // Common UI elements
      'ui.blockchainVerified': 'Blockchain Verified',
      'ui.viewOriginalDocument': 'View Original Document',
      'ui.translateDocument': 'Translate Document',
      'ui.viewTranslation': 'View Translation',
      'ui.selectLanguage': 'Select Language',
      'ui.back': 'Back',
      'ui.loading': 'Loading...',
      'ui.error': 'Error',
    }
  },
  fr: {
    translation: {
      // Document Types
      'documentType.billOfLading': 'Connaissement',
      'documentType.letterOfCredit': 'Lettre de Crédit',
      'documentType.certificateOfOrigin': "Certificat d'Origine",
      'documentType.phytosanitary': 'Certificat Phytosanitaire',
      'documentType.commercialInvoice': 'Facture Commerciale',
      'documentType.packingList': 'Liste de Colisage',
      'documentType.insuranceCertificate': "Certificat d'Assurance",
      'documentType.document': 'Document',
      
      // Common Document Fields
      'document.date': 'Date',
      'document.referenceNumber': 'Numéro de Référence',
      'document.shipper': 'Expéditeur',
      'document.consignee': 'Destinataire',
      'document.notifyParty': 'Partie à Notifier',
      'document.vessel': 'Navire/Voyage',
      'document.portOfLoading': 'Port de Chargement',
      'document.portOfDischarge': 'Port de Déchargement',
      'document.description': 'Description des Marchandises',
      'document.grossWeight': 'Poids Brut',
      'document.measurement': 'Dimensions',
      'document.marksAndNumbers': 'Marques et Numéros',
      'document.containerNo': 'N° de Conteneur',
      'document.sealNo': 'N° de Scellé',
      
      // Bill of Lading specific
      'billOfLading.freight': 'Frais de Transport',
      'billOfLading.prepaid': 'Payé d\'Avance',
      'billOfLading.collect': 'À Percevoir',
      'billOfLading.originalBL': 'Connaissement Original',
      'billOfLading.declaredValue': 'Valeur Déclarée',
      
      // Certificate of Origin specific
      'certificateOfOrigin.producer': 'Producteur',
      'certificateOfOrigin.countryOfOrigin': 'Pays d\'Origine',
      'certificateOfOrigin.countryOfDestination': 'Pays de Destination',
      'certificateOfOrigin.declaration': 'Déclaration de l\'Exportateur',
      'certificateOfOrigin.certification': 'Certification',
      'certificateOfOrigin.issuingAuthority': 'Autorité de Délivrance',
      
      // Letter of Credit specific
      'letterOfCredit.issuer': 'Banque Émettrice',
      'letterOfCredit.applicant': 'Demandeur',
      'letterOfCredit.beneficiary': 'Bénéficiaire',
      'letterOfCredit.amount': 'Montant',
      'letterOfCredit.expiryDate': 'Date d\'Expiration',
      'letterOfCredit.partial': 'Expéditions Partielles',
      'letterOfCredit.transhipment': 'Transbordement',
      'letterOfCredit.loading': 'Chargement',
      'letterOfCredit.discharge': 'Déchargement',
      'letterOfCredit.documentsRequired': 'Documents Requis',
      'letterOfCredit.specialConditions': 'Conditions Spéciales',
      
      // Phytosanitary specific
      'phytosanitary.plantProtection': 'Organisation de Protection des Végétaux',
      'phytosanitary.botanicalName': 'Nom Botanique des Plantes',
      'phytosanitary.treatment': 'Traitement de Désinfestion et/ou Désinfection',
      'phytosanitary.additionalDeclaration': 'Déclaration Additionnelle',
      
      // Common UI elements
      'ui.blockchainVerified': 'Vérifié par Blockchain',
      'ui.viewOriginalDocument': 'Voir Document Original',
      'ui.translateDocument': 'Traduire le Document',
      'ui.viewTranslation': 'Voir la Traduction',
      'ui.selectLanguage': 'Sélectionner la Langue',
      'ui.back': 'Retour',
      'ui.loading': 'Chargement...',
      'ui.error': 'Erreur',
    }
  },
  es: {
    translation: {
      // Document Types
      'documentType.billOfLading': 'Conocimiento de Embarque',
      'documentType.letterOfCredit': 'Carta de Crédito',
      'documentType.certificateOfOrigin': 'Certificado de Origen',
      'documentType.phytosanitary': 'Certificado Fitosanitario',
      'documentType.commercialInvoice': 'Factura Comercial',
      'documentType.packingList': 'Lista de Empaque',
      'documentType.insuranceCertificate': 'Certificado de Seguro',
      'documentType.document': 'Documento',
      
      // Common Document Fields
      'document.date': 'Fecha',
      'document.referenceNumber': 'Número de Referencia',
      'document.shipper': 'Remitente/Exportador',
      'document.consignee': 'Consignatario',
      'document.notifyParty': 'Parte a Notificar',
      'document.vessel': 'Buque/Viaje',
      'document.portOfLoading': 'Puerto de Carga',
      'document.portOfDischarge': 'Puerto de Descarga',
      'document.description': 'Descripción de Mercancía',
      'document.grossWeight': 'Peso Bruto',
      'document.measurement': 'Medidas',
      'document.marksAndNumbers': 'Marcas y Números',
      'document.containerNo': 'N° de Contenedor',
      'document.sealNo': 'N° de Precinto',
      
      // Bill of Lading specific
      'billOfLading.freight': 'Gastos de Flete',
      'billOfLading.prepaid': 'Prepagado',
      'billOfLading.collect': 'Por Cobrar',
      'billOfLading.originalBL': 'Conocimiento de Embarque Original',
      'billOfLading.declaredValue': 'Valor Declarado',
      
      // Certificate of Origin specific
      'certificateOfOrigin.producer': 'Productor',
      'certificateOfOrigin.countryOfOrigin': 'País de Origen',
      'certificateOfOrigin.countryOfDestination': 'País de Destino',
      'certificateOfOrigin.declaration': 'Declaración del Exportador',
      'certificateOfOrigin.certification': 'Certificación',
      'certificateOfOrigin.issuingAuthority': 'Autoridad Emisora',
      
      // Letter of Credit specific
      'letterOfCredit.issuer': 'Banco Emisor',
      'letterOfCredit.applicant': 'Solicitante',
      'letterOfCredit.beneficiary': 'Beneficiario',
      'letterOfCredit.amount': 'Importe',
      'letterOfCredit.expiryDate': 'Fecha de Vencimiento',
      'letterOfCredit.partial': 'Embarques Parciales',
      'letterOfCredit.transhipment': 'Transbordo',
      'letterOfCredit.loading': 'Carga',
      'letterOfCredit.discharge': 'Descarga',
      'letterOfCredit.documentsRequired': 'Documentos Requeridos',
      'letterOfCredit.specialConditions': 'Condiciones Especiales',
      
      // Phytosanitary specific
      'phytosanitary.plantProtection': 'Organización de Protección Fitosanitaria',
      'phytosanitary.botanicalName': 'Nombre Botánico de las Plantas',
      'phytosanitary.treatment': 'Tratamiento de Desinfestación y/o Desinfección',
      'phytosanitary.additionalDeclaration': 'Declaración Adicional',
      
      // Common UI elements
      'ui.blockchainVerified': 'Verificado por Blockchain',
      'ui.viewOriginalDocument': 'Ver Documento Original',
      'ui.translateDocument': 'Traducir Documento',
      'ui.viewTranslation': 'Ver Traducción',
      'ui.selectLanguage': 'Seleccionar Idioma',
      'ui.back': 'Volver',
      'ui.loading': 'Cargando...',
      'ui.error': 'Error',
    }
  },
  zh: {
    translation: {
      // Document Types
      'documentType.billOfLading': '提单',
      'documentType.letterOfCredit': '信用证',
      'documentType.certificateOfOrigin': '原产地证书',
      'documentType.phytosanitary': '植物检疫证书',
      'documentType.commercialInvoice': '商业发票',
      'documentType.packingList': '装箱单',
      'documentType.insuranceCertificate': '保险证书',
      'documentType.document': '文件',
      
      // Common Document Fields
      'document.date': '日期',
      'document.referenceNumber': '参考编号',
      'document.shipper': '发货人/出口商',
      'document.consignee': '收货人',
      'document.notifyParty': '通知方',
      'document.vessel': '船舶/航次',
      'document.portOfLoading': '装货港',
      'document.portOfDischarge': '卸货港',
      'document.description': '货物描述',
      'document.grossWeight': '毛重',
      'document.measurement': '尺寸',
      'document.marksAndNumbers': '标记和编号',
      'document.containerNo': '集装箱号',
      'document.sealNo': '封条号',
      
      // Bill of Lading specific
      'billOfLading.freight': '运费',
      'billOfLading.prepaid': '预付',
      'billOfLading.collect': '到付',
      'billOfLading.originalBL': '正本提单',
      'billOfLading.declaredValue': '申报价值',
      
      // Certificate of Origin specific
      'certificateOfOrigin.producer': '生产商',
      'certificateOfOrigin.countryOfOrigin': '原产国',
      'certificateOfOrigin.countryOfDestination': '目的国',
      'certificateOfOrigin.declaration': '出口商声明',
      'certificateOfOrigin.certification': '认证',
      'certificateOfOrigin.issuingAuthority': '签发机构',
      
      // Letter of Credit specific
      'letterOfCredit.issuer': '开证银行',
      'letterOfCredit.applicant': '申请人',
      'letterOfCredit.beneficiary': '受益人',
      'letterOfCredit.amount': '金额',
      'letterOfCredit.expiryDate': '到期日',
      'letterOfCredit.partial': '分批装运',
      'letterOfCredit.transhipment': '转运',
      'letterOfCredit.loading': '装运',
      'letterOfCredit.discharge': '卸货',
      'letterOfCredit.documentsRequired': '所需单据',
      'letterOfCredit.specialConditions': '特殊条件',
      
      // Phytosanitary specific
      'phytosanitary.plantProtection': '植物保护组织',
      'phytosanitary.botanicalName': '植物学名',
      'phytosanitary.treatment': '除害及/或消毒处理',
      'phytosanitary.additionalDeclaration': '附加声明',
      
      // Common UI elements
      'ui.blockchainVerified': '区块链已验证',
      'ui.viewOriginalDocument': '查看原始文件',
      'ui.translateDocument': '翻译文件',
      'ui.viewTranslation': '查看翻译',
      'ui.selectLanguage': '选择语言',
      'ui.back': '返回',
      'ui.loading': '加载中...',
      'ui.error': '错误',
    }
  },
  sw: {
    translation: {
      // Document Types
      'documentType.billOfLading': 'Hati ya Usafirishaji',
      'documentType.letterOfCredit': 'Barua ya Mkopo',
      'documentType.certificateOfOrigin': 'Cheti cha Asili',
      'documentType.phytosanitary': 'Cheti cha Afya ya Mimea',
      'documentType.commercialInvoice': 'Ankara ya Biashara',
      'documentType.packingList': 'Orodha ya Ufungaji',
      'documentType.insuranceCertificate': 'Cheti cha Bima',
      'documentType.document': 'Waraka',
      
      // Common Document Fields
      'document.date': 'Tarehe',
      'document.referenceNumber': 'Namba ya Rejea',
      'document.shipper': 'Msafirishaji/Muuzaji nje',
      'document.consignee': 'Mpokeaji',
      'document.notifyParty': 'Upande wa Kuarifu',
      'document.vessel': 'Meli/Safari',
      'document.portOfLoading': 'Bandari ya Upakiaji',
      'document.portOfDischarge': 'Bandari ya Kupakulia',
      'document.description': 'Maelezo ya Bidhaa',
      'document.grossWeight': 'Uzito Kamili',
      'document.measurement': 'Vipimo',
      'document.marksAndNumbers': 'Alama na Namba',
      'document.containerNo': 'Namba ya Kontena',
      'document.sealNo': 'Namba ya Lakiri',
      
      // Bill of Lading specific
      'billOfLading.freight': 'Gharama za Usafirishaji',
      'billOfLading.prepaid': 'Imelipiwa Awali',
      'billOfLading.collect': 'Kukusanya',
      'billOfLading.originalBL': 'Hati ya Usafirishaji Halisi',
      'billOfLading.declaredValue': 'Thamani Iliyotangazwa',
      
      // Certificate of Origin specific
      'certificateOfOrigin.producer': 'Mzalishaji',
      'certificateOfOrigin.countryOfOrigin': 'Nchi ya Asili',
      'certificateOfOrigin.countryOfDestination': 'Nchi ya Mwisho',
      'certificateOfOrigin.declaration': 'Tamko la Muuzaji nje',
      'certificateOfOrigin.certification': 'Uthibitishaji',
      'certificateOfOrigin.issuingAuthority': 'Mamlaka ya Utoaji',
      
      // Letter of Credit specific
      'letterOfCredit.issuer': 'Benki Mtoa',
      'letterOfCredit.applicant': 'Mwombaji',
      'letterOfCredit.beneficiary': 'Mnufaika',
      'letterOfCredit.amount': 'Kiasi',
      'letterOfCredit.expiryDate': 'Tarehe ya Kumalizika',
      'letterOfCredit.partial': 'Usafirishaji wa Sehemu',
      'letterOfCredit.transhipment': 'Ubadilishaji Meli',
      'letterOfCredit.loading': 'Upakiaji',
      'letterOfCredit.discharge': 'Utoaji',
      'letterOfCredit.documentsRequired': 'Nyaraka Zinazohitajika',
      'letterOfCredit.specialConditions': 'Masharti Maalum',
      
      // Phytosanitary specific
      'phytosanitary.plantProtection': 'Shirika la Ulinzi wa Mimea',
      'phytosanitary.botanicalName': 'Jina la Kisayansi la Mimea',
      'phytosanitary.treatment': 'Matibabu ya Kuondoa Wadudu/Ugonjwa',
      'phytosanitary.additionalDeclaration': 'Tamko la Ziada',
      
      // Common UI elements
      'ui.blockchainVerified': 'Imethibitishwa na Blockchain',
      'ui.viewOriginalDocument': 'Tazama Waraka Halisi',
      'ui.translateDocument': 'Tafsiri Waraka',
      'ui.viewTranslation': 'Tazama Tafsiri',
      'ui.selectLanguage': 'Chagua Lugha',
      'ui.back': 'Rudi',
      'ui.loading': 'Inapakia...',
      'ui.error': 'Hitilafu',
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector) // detects user language
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;