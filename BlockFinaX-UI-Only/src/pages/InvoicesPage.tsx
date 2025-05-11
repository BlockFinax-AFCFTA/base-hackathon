import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Receipt, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Download
} from 'lucide-react';
import { invoices } from '@/data/mockData';
import { formatDate } from '@/utils/helpers';

const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<typeof invoices[0] | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </span>
        );
      case 'overdue':
        return (
          <span className="flex items-center text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded-full">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </span>
        );
      case 'sent':
        return (
          <span className="flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            Sent
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
            <Receipt className="h-3 w-3 mr-1" />
            Draft
          </span>
        );
      default:
        return (
          <span className="flex items-center text-xs font-medium text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage blockchain-powered invoices
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search invoices..." 
            className="w-full rounded-md border border-input pl-9 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="rounded-md border border-input px-3 py-2 text-sm"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted text-sm font-medium">
            <div className="col-span-3">Invoice</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
          </div>
          <div className="divide-y">
            {filteredInvoices.map(invoice => (
              <div 
                key={invoice.id} 
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/30 cursor-pointer"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="col-span-3">
                  <div className="font-medium">{invoice.invoiceNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {invoice.contractName ? `Contract: ${invoice.contractName}` : 'No contract'}
                  </div>
                </div>
                <div className="col-span-3">
                  <div>{invoice.customer.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {invoice.customer.wallet.slice(0, 6)}...{invoice.customer.wallet.slice(-4)}
                  </div>
                </div>
                <div className="col-span-2 font-medium">
                  {invoice.total} {invoice.currency}
                </div>
                <div className="col-span-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                    {formatDate(invoice.issueDate)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Due: {formatDate(invoice.dueDate)}
                  </div>
                </div>
                <div className="col-span-2">
                  {getStatusBadge(invoice.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center h-64 text-center">
          <Receipt className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No invoices found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || statusFilter 
              ? "Try adjusting your search or filters"
              : "Create your first invoice to get started"
            }
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </button>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">{selectedInvoice.invoiceNumber}</h2>
                <p className="text-sm text-muted-foreground">Issued on {formatDate(selectedInvoice.issueDate)}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-md border">
                  <Download className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-md border"
                >
                  &times;
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground mb-1">From</div>
                <div className="font-medium">BlockFinaX Corp</div>
                <div className="text-sm">123 Blockchain Street</div>
                <div className="text-sm">Finance District, BC 12345</div>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="text-sm text-muted-foreground mb-1">To</div>
                <div className="font-medium">{selectedInvoice.customer.name}</div>
                <div className="text-sm font-mono">{selectedInvoice.customer.wallet.slice(0, 10)}...{selectedInvoice.customer.wallet.slice(-8)}</div>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-hidden mb-6">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted text-sm font-medium">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Total</div>
              </div>
              <div className="divide-y">
                {selectedInvoice.items.map(item => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-3">
                    <div className="col-span-6">
                      <div className="font-medium">{item.description}</div>
                    </div>
                    <div className="col-span-2 text-right">{item.quantity}</div>
                    <div className="col-span-2 text-right">{item.unitPrice} {selectedInvoice.currency}</div>
                    <div className="col-span-2 text-right font-medium">{item.unitPrice * item.quantity} {selectedInvoice.currency}</div>
                  </div>
                ))}
              </div>
              <div className="border-t px-4 py-3 bg-muted/30 flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">{selectedInvoice.total} {selectedInvoice.currency}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border rounded-md"
                >
                  Close
                </button>
                {selectedInvoice.status === 'sent' && (
                  <button className="px-4 py-2 bg-primary text-white rounded-md">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>
            <p className="text-muted-foreground mb-4">
              Modal content would go here with invoice creation form
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;