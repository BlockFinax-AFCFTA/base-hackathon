import { 
  File, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  FilePdf, 
  Presentation, 
  FileCode,
  Ship,
  BarChart3,
  BriefcaseBusiness,
  FileCheck
} from 'lucide-react';

// Returns the appropriate icon component based on file type/extension
export const getDocumentIcon = (fileType: string) => {
  const type = fileType.toLowerCase();
  
  // Images
  if (type.match(/^(image|png|jpg|jpeg|gif|svg|webp)$/)) {
    return FileImage;
  }
  // PDF
  else if (type === 'pdf') {
    return FilePdf;
  }
  // Spreadsheets
  else if (type.match(/^(xlsx|xls|csv|sheet|spreadsheet)$/)) {
    return FileSpreadsheet;
  }
  // Presentations
  else if (type.match(/^(ppt|pptx|presentation|slide)$/)) {
    return Presentation;
  }
  // Code/development files
  else if (type.match(/^(json|xml|html|js|jsx|ts|tsx|py|java|c|cpp|php)$/)) {
    return FileCode;
  }
  // Shipping documents
  else if (type.match(/^(bill of lading|shipping|bl)$/)) {
    return Ship;
  }
  // Financial documents
  else if (type.match(/^(invoice|payment|financial|receipt)$/)) {
    return BarChart3;
  }
  // Contract documents
  else if (type.match(/^(contract|agreement|legal)$/)) {
    return BriefcaseBusiness;
  }
  // Certificate documents
  else if (type.match(/^(certificate|certification|license)$/)) {
    return FileCheck;
  }
  // Text documents
  else if (type.match(/^(doc|docx|txt|text|rtf)$/)) {
    return FileText;
  }
  // Default
  else {
    return File;
  }
};

// Format file size to human-readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Generate document tags based on document type and name
export const generateDocumentTags = (name: string, type: string): string[] => {
  const tags: string[] = [];
  
  // Add file type as a tag
  tags.push(type.toLowerCase());
  
  // Check for specific document types in the name
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('invoice')) tags.push('invoice');
  if (lowerName.includes('contract')) tags.push('contract');
  if (lowerName.includes('bill of lading') || lowerName.includes('bl')) tags.push('shipping');
  if (lowerName.includes('certificate')) tags.push('certificate');
  if (lowerName.includes('permit')) tags.push('permit');
  if (lowerName.includes('insurance')) tags.push('insurance');
  if (lowerName.includes('origin')) tags.push('origin');
  if (lowerName.includes('purchase')) tags.push('purchase');
  if (lowerName.includes('cargo')) tags.push('cargo');
  if (lowerName.includes('import')) tags.push('import');
  if (lowerName.includes('export')) tags.push('export');
  
  return [...new Set(tags)]; // Remove duplicates
};

// Check if a document is a viewable type in the browser
export const isViewableInBrowser = (fileType: string): boolean => {
  const type = fileType.toLowerCase();
  return type === 'pdf' || 
         type.match(/^(image|png|jpg|jpeg|gif|svg|webp)$/) !== null || 
         type.match(/^(txt|text)$/) !== null;
};

// Generate preview URL for document
export const getDocumentPreviewUrl = (url: string, fileType: string): string => {
  if (isViewableInBrowser(fileType)) {
    return url;
  }
  // For non-viewable documents, could return a thumbnail or preview service URL
  // For now, just return the original URL
  return url;
};