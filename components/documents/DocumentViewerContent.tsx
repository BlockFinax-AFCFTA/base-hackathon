import React from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentViewerContentProps {
  content: string;
  documentType: string;
}

export default function DocumentViewerContent({ content, documentType }: DocumentViewerContentProps) {
  const { t } = useTranslation();
  
  // Function to add specific highlighting and formatting based on document type
  const formatContent = (text: string, type: string) => {
    const lowerType = type.toLowerCase();
    
    // Create a properly formatted HTML version of the document
    // with special attention to the document structure
    
    if (lowerType.includes('bill of lading')) {
      return formatBillOfLading(text);
    } else if (lowerType.includes('letter of credit')) {
      return formatLetterOfCredit(text);
    } else if (lowerType.includes('certificate of origin')) {
      return formatCertificateOfOrigin(text);
    } else if (lowerType.includes('phytosanitary')) {
      return formatPhytosanitaryCertificate(text);
    }
    
    // Default formatting for other document types
    return formatGenericDocument(text);
  };
  
  const formatBillOfLading = (text: string) => {
    // Highlight headers
    let formattedText = text.replace(
      /(BILL OF LADING|ORIGINAL|NON-NEGOTIABLE)/g, 
      '<span class="text-lg font-bold">$1</span>'
    );
    
    // Highlight main sections
    formattedText = formattedText.replace(
      /(Shipper\/Exporter:|Consignee:|Vessel\/Voyage:|Port of Loading:|Port of Discharge:|Place of Delivery:|Container No\.\/Seal No\.|Marks & Numbers|No\. of Pkgs|Description of Goods|Gross Weight:|Measurement:|TOTAL PACKAGES:|DECLARED VALUE:|Shipped on board|BLOCKCHAIN VERIFICATION)/g,
      '<span class="font-medium text-blue-700">$1</span>'
    );
    
    // Apply line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    // Add spacing between sections
    formattedText = formattedText.replace(/<br \/><br \/>/g, '<div class="my-2"></div>');
    
    // Highlight the blockchain verification section
    formattedText = formattedText.replace(
      /-{80,}<br \/>(.*?BLOCKCHAIN VERIFICATION.*?)(<br \/>.*?<br \/>.*?<br \/>.*?<br \/>.*?<br \/>)-{80,}/s,
      '<div class="mt-4 p-3 bg-gray-100 border border-gray-300 rounded"><strong class="block text-center mb-2">$1</strong>$2</div>'
    );
    
    // Highlight transaction hash and block number
    formattedText = formattedText.replace(
      /(Transaction Hash: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-green-600">$2</span>'
    );
    
    formattedText = formattedText.replace(
      /(Block Number: )(\d+)/g,
      '$1<span class="font-mono">$2</span>'
    );
    
    return formattedText;
  };
  
  const formatLetterOfCredit = (text: string) => {
    // Highlight headers
    let formattedText = text.replace(
      /(IRREVOCABLE DOCUMENTARY LETTER OF CREDIT)/g, 
      '<span class="text-lg font-bold">$1</span>'
    );
    
    // Highlight main sections
    formattedText = formattedText.replace(
      /(ISSUING BANK:|APPLICANT:|BENEFICIARY:|ADVISING BANK:|AMOUNT:|AVAILABLE WITH:|PARTIAL SHIPMENTS:|TRANSHIPMENT:|LOADING:|DISCHARGE:|LATEST SHIPMENT DATE:|DESCRIPTION OF GOODS:|DOCUMENTS REQUIRED:|SPECIAL CONDITIONS:|BLOCKCHAIN VERIFICATION)/g,
      '<span class="font-medium text-blue-700">$1</span>'
    );
    
    // Apply line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    // Add spacing between sections
    formattedText = formattedText.replace(/<br \/><br \/>/g, '<div class="my-2"></div>');
    
    // Highlight the blockchain verification section
    formattedText = formattedText.replace(
      /-{80,}<br \/>(.*?BLOCKCHAIN VERIFICATION.*?)(<br \/>.*?<br \/>.*?<br \/>.*?<br \/>.*?<br \/>)-{80,}/s,
      '<div class="mt-4 p-3 bg-gray-100 border border-gray-300 rounded"><strong class="block text-center mb-2">$1</strong>$2</div>'
    );
    
    // Highlight transaction hash and smart contract
    formattedText = formattedText.replace(
      /(Transaction Hash: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-green-600">$2</span>'
    );
    
    formattedText = formattedText.replace(
      /(Smart Contract: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-blue-600">$2</span>'
    );
    
    return formattedText;
  };
  
  const formatCertificateOfOrigin = (text: string) => {
    // Highlight headers
    let formattedText = text.replace(
      /(CERTIFICATE OF ORIGIN|ORIGINAL COPY)/g, 
      '<span class="text-lg font-bold">$1</span>'
    );
    
    // Highlight main sections and numbered items
    formattedText = formattedText.replace(
      /(1\. Exporter|2\. Importer|3\. Country of Origin|4\. Transport Details|5\. Remarks|6\. Item|7\. Marks & Numbers|8\. No\. & Kind|9\. HS Code|10\. Description of Goods|11\. Gross|12\. Invoice|13\. EXPORTER'S DECLARATION|14\. CERTIFICATION|BLOCKCHAIN VERIFICATION)/g,
      '<span class="font-medium text-blue-700">$1</span>'
    );
    
    // Apply line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    // Add spacing between sections
    formattedText = formattedText.replace(/<br \/><br \/>/g, '<div class="my-2"></div>');
    
    // Highlight the blockchain verification section
    formattedText = formattedText.replace(
      /-{80,}<br \/>(.*?BLOCKCHAIN VERIFICATION.*?)(<br \/>.*?<br \/>.*?<br \/>.*?<br \/>.*?<br \/>)-{80,}/s,
      '<div class="mt-4 p-3 bg-gray-100 border border-gray-300 rounded"><strong class="block text-center mb-2">$1</strong>$2</div>'
    );
    
    // Highlight transaction hash and smart contract
    formattedText = formattedText.replace(
      /(Transaction Hash: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-green-600">$2</span>'
    );
    
    formattedText = formattedText.replace(
      /(Smart Contract: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-blue-600">$2</span>'
    );
    
    return formattedText;
  };
  
  const formatPhytosanitaryCertificate = (text: string) => {
    // Highlight headers
    let formattedText = text.replace(
      /(PHYTOSANITARY CERTIFICATE|ORIGINAL)/g, 
      '<span class="text-lg font-bold">$1</span>'
    );
    
    // Highlight main sections
    formattedText = formattedText.replace(
      /(PLANT PROTECTION ORGANIZATION OF:|TO: PLANT PROTECTION ORGANIZATION\(S\) OF:|I\. DESCRIPTION OF CONSIGNMENT|II\. ADDITIONAL DECLARATION|III\. DISINFESTATION AND\/OR DISINFECTION TREATMENT|IV\. ADDITIONAL INFORMATION|V\. STAMP OF ORGANIZATION|BLOCKCHAIN VERIFICATION)/g,
      '<span class="font-medium text-blue-700">$1</span>'
    );
    
    // Highlight subsections
    formattedText = formattedText.replace(
      /(Name and address of exporter:|Declared name and address of consignee:|Number and description of packages:|Distinguishing marks:|Place of origin:|Declared means of conveyance:|Declared point of entry:|Name of produce and quantity declared:|Botanical name of plants:|Date:|Treatment:|Chemical \(active ingredient\):|Duration and temperature:|Concentration:|Additional information:|PLACE OF ISSUE:|DATE:|NAME OF AUTHORIZED OFFICER:)/g,
      '<span class="font-semibold text-indigo-600">$1</span>'
    );
    
    // Apply line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    // Add spacing between sections
    formattedText = formattedText.replace(/<br \/><br \/>/g, '<div class="my-2"></div>');
    
    // Highlight the blockchain verification section
    formattedText = formattedText.replace(
      /-{80,}<br \/>(.*?BLOCKCHAIN VERIFICATION.*?)(<br \/>.*?<br \/>.*?<br \/>.*?<br \/>.*?<br \/>)-{80,}/s,
      '<div class="mt-4 p-3 bg-gray-100 border border-gray-300 rounded"><strong class="block text-center mb-2">$1</strong>$2</div>'
    );
    
    // Highlight transaction hash and smart contract
    formattedText = formattedText.replace(
      /(Transaction Hash: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-green-600">$2</span>'
    );
    
    formattedText = formattedText.replace(
      /(Smart Contract: )(0x[a-fA-F0-9]+)/g,
      '$1<span class="font-mono text-blue-600">$2</span>'
    );
    
    return formattedText;
  };
  
  const formatGenericDocument = (text: string) => {
    // Apply basic formatting for any document type
    let formattedText = text;
    
    // Convert line breaks
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    // Add spacing between sections
    formattedText = formattedText.replace(/<br \/><br \/>/g, '<div class="my-2"></div>');
    
    // Highlight blockchain verification section if present
    if (formattedText.includes('BLOCKCHAIN VERIFICATION')) {
      formattedText = formattedText.replace(
        /-{10,}<br \/>(.*?BLOCKCHAIN VERIFICATION.*?)(<br \/>.*?<br \/>.*?<br \/>.*?<br \/>)-{10,}/s,
        '<div class="mt-4 p-3 bg-gray-100 border border-gray-300 rounded"><strong class="block text-center mb-2">$1</strong>$2</div>'
      );
    }
    
    return formattedText;
  };
  
  // Format the content based on document type
  const formattedContent = formatContent(content, documentType);
  
  return (
    <div 
      className="document-content font-sans text-gray-800 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}