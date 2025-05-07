/**
 * Identifies the type of document based on its URL or content
 * @param url The URL of the document
 * @param content Optional document content for more accurate detection
 * @returns The identified document type as a string
 */
export function identifyTemplateDocType(url: string, content?: string): string {
  // First, check if it's one of our template documents
  const filenameLower = url.toLowerCase();
  
  if (filenameLower.includes('bill-of-lading') || filenameLower.includes('bol')) {
    return 'Bill of Lading';
  }
  
  if (filenameLower.includes('letter-of-credit') || filenameLower.includes('loc')) {
    return 'Letter of Credit';
  }
  
  if (filenameLower.includes('certificate-of-origin') || filenameLower.includes('coo')) {
    return 'Certificate of Origin';
  }
  
  if (filenameLower.includes('phytosanitary') || filenameLower.includes('phyto')) {
    return 'Phytosanitary Certificate';
  }
  
  // If the URL doesn't give us enough information, check the content if provided
  if (content) {
    const contentLower = content.toLowerCase();
    
    if (
      contentLower.includes('bill of lading') || 
      contentLower.includes('shipped on board') || 
      contentLower.includes('vessel/voyage') ||
      contentLower.includes('port of loading')
    ) {
      return 'Bill of Lading';
    }
    
    if (
      contentLower.includes('letter of credit') || 
      contentLower.includes('irrevocable documentary letter of credit') || 
      contentLower.includes('issuing bank') || 
      contentLower.includes('beneficiary')
    ) {
      return 'Letter of Credit';
    }
    
    if (
      contentLower.includes('certificate of origin') || 
      contentLower.includes('exporter declaration') || 
      contentLower.includes('country of origin')
    ) {
      return 'Certificate of Origin';
    }
    
    if (
      contentLower.includes('phytosanitary certificate') || 
      contentLower.includes('plant protection') || 
      contentLower.includes('botanical name')
    ) {
      return 'Phytosanitary Certificate';
    }
  }
  
  // Default, if we can't identify the document type
  return 'Generic Document';
}

/**
 * Checks if a document is a template document
 * @param url The URL of the document
 * @returns True if the document is a template document
 */
export function isTemplateDocument(url: string): boolean {
  const docType = identifyTemplateDocType(url);
  return docType !== 'Generic Document';
}

/**
 * Gets the appropriate document icon based on the document type and file extension
 * @param url The URL or filename of the document
 * @param fileType The file type (optional, for more accurate detection)
 * @returns The name of the icon to use
 */
export function getDocumentIcon(url: string, fileType?: string): string {
  const docType = identifyTemplateDocType(url);
  
  // For template documents, return specific icons
  if (docType === 'Bill of Lading') {
    return 'Ship';
  }
  
  if (docType === 'Letter of Credit') {
    return 'CreditCard';
  }
  
  if (docType === 'Certificate of Origin') {
    return 'Certificate';
  }
  
  if (docType === 'Phytosanitary Certificate') {
    return 'Leaf';
  }
  
  // For non-template documents, determine by file extension
  const extension = fileType || url.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'pdf':
      return 'FileText';
    case 'docx':
    case 'doc':
      return 'FileText';
    case 'xlsx':
    case 'xls':
      return 'Table';
    case 'pptx':
    case 'ppt':
      return 'LineChart';
    case 'txt':
      return 'FileText';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'Image';
    default:
      return 'File';
  }
}

/**
 * Format a file size in bytes into a human-readable string
 * @param bytes The size in bytes
 * @returns A formatted string like "2.5 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}