import React, { useEffect, useState } from 'react';
import { FileText, Upload, Search, Filter, CheckCircle, AlertCircle } from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { formatDate } from '@/utils/helpers';

const DocumentsPage: React.FC = () => {
  const { documents, loading, getDocuments } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    getDocuments();
  }, []);

  // Filter documents based on search and type
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? doc.fileType === typeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-sm text-muted-foreground">
            Manage your blockchain-verified documents
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search documents..." 
            className="w-full rounded-md border border-input pl-9 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="rounded-md border border-input px-3 py-2 text-sm"
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || null)}
          >
            <option value="">All types</option>
            <option value="pdf">PDF</option>
            <option value="docx">Word</option>
            <option value="xlsx">Excel</option>
            <option value="jpg">Image</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading documents...</p>
        </div>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="rounded-lg border bg-card p-5 shadow hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className="h-10 w-10 flex items-center justify-center rounded bg-muted/50">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                {doc.isVerified ? (
                  <div className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </div>
                )}
              </div>
              <h3 className="font-semibold line-clamp-1 mb-1">{doc.name}</h3>
              {doc.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{doc.description}</p>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{doc.fileType.toUpperCase()}</span>
                <span>{(doc.fileSize / 1000).toFixed(0)} KB</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2 pt-2 border-t">
                <span>Uploaded: {formatDate(doc.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No documents found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || typeFilter 
              ? "Try adjusting your search or filters"
              : "Upload your first document to get started"
            }
          </p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>
      )}

      {/* Upload Modal would go here */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <p className="text-muted-foreground mb-4">
              Modal content would go here with file upload controls
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;