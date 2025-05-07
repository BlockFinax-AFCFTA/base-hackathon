/**
 * Utility functions for document handling and formatting
 */

import { FileText, File, FileSpreadsheet, FileArchive, Archive, Image, Book, PenTool, FileCode, Film } from 'lucide-react';

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets the appropriate icon component for a file type
 * @param fileType The file's MIME type or extension
 * @returns React component for the file icon
 */
export function getDocumentIcon(fileType: string) {
  const type = fileType.toLowerCase();

  if (type.includes('pdf')) return FileText;
  if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg') || type.includes('gif')) return Image;
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('xlsx') || type.includes('csv')) return FileSpreadsheet;
  if (type.includes('zip') || type.includes('compress') || type.includes('rar')) return FileArchive;
  if (type.includes('text/plain') || type.includes('txt')) return File;
  if (type.includes('word') || type.includes('doc')) return Book;
  if (type.includes('presentation') || type.includes('ppt')) return PenTool;
  if (type.includes('code') || type.includes('json') || type.includes('xml') || type.includes('html')) return FileCode;
  if (type.includes('video')) return Film;
  return File; // Default icon
}

/**
 * Generates a set of relevant tags based on filename and file type
 * @param filename The name of the file
 * @param fileType The file's MIME type or extension
 * @returns Array of tag strings
 */
export function generateDocumentTags(filename: string, fileType: string): string[] {
  const tags: string[] = [];
  const lowercaseFilename = filename.toLowerCase();
  const lowercaseType = fileType.toLowerCase();

  // Add tag based on file type
  if (lowercaseType.includes('pdf')) tags.push('pdf');
  else if (lowercaseType.includes('image')) tags.push('image');
  else if (lowercaseType.includes('spreadsheet') || lowercaseType.includes('excel')) tags.push('spreadsheet');
  else if (lowercaseType.includes('word') || lowercaseType.includes('doc')) tags.push('document');
  else if (lowercaseType.includes('text/plain')) tags.push('text');

  // Add tags based on document content type (from filename)
  if (lowercaseFilename.includes('invoice')) tags.push('invoice');
  if (lowercaseFilename.includes('contract')) tags.push('contract');
  if (lowercaseFilename.includes('agreement')) tags.push('agreement');
  if (lowercaseFilename.includes('report')) tags.push('report');
  if (lowercaseFilename.includes('certificate')) tags.push('certificate');
  if (lowercaseFilename.includes('origin')) tags.push('origin');
  if (lowercaseFilename.includes('bill') && lowercaseFilename.includes('lading')) tags.push('bill of lading');
  if (lowercaseFilename.includes('packing') && lowercaseFilename.includes('list')) tags.push('packing list');
  if (lowercaseFilename.includes('letter') && lowercaseFilename.includes('credit')) tags.push('letter of credit');
  if (lowercaseFilename.includes('phytosanitary')) tags.push('phytosanitary');
  if (lowercaseFilename.includes('insurance')) tags.push('insurance');

  return tags;
}

/**
 * Identifies the document type based on template URL path or filename
 * @param url Document URL or path
 * @returns Human-readable document type string
 */
export function identifyTemplateDocType(url: string): string {
  if (!url) return 'Document';
  
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes('bill-of-lading')) return 'Bill of Lading';
  if (lowercaseUrl.includes('letter-of-credit')) return 'Letter of Credit';
  if (lowercaseUrl.includes('certificate-of-origin')) return 'Certificate of Origin';
  if (lowercaseUrl.includes('phytosanitary')) return 'Phytosanitary Certificate';
  if (lowercaseUrl.includes('commercial-invoice')) return 'Commercial Invoice';
  if (lowercaseUrl.includes('packing-list')) return 'Packing List';
  if (lowercaseUrl.includes('insurance')) return 'Insurance Certificate';
  if (lowercaseUrl.includes('contract')) return 'Contract';
  if (lowercaseUrl.includes('invoice')) return 'Invoice';
  
  return 'Document';
}