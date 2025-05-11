import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  CreditCard,
  DollarSign,
  CalendarClock,
  Eye,
  User,
  Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';

import { mockInvoices } from '@/data/mockInvoices';
import { formatDate, formatCurrency } from '@/lib/utils';

const InvoicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<typeof mockInvoices[0] | null>(null);
  
  // Filter invoices based on active tab and search query
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'paid' && invoice.status === 'paid') ||
      (activeTab === 'pending' && (invoice.status === 'sent' || invoice.status === 'draft')) ||
      (activeTab === 'overdue' && invoice.status === 'overdue');
      
    const matchesSearch = 
      searchQuery === '' ||
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.contractName && invoice.contractName.toLowerCase().includes(searchQuery.toLowerCase()));
      
    return matchesTab && matchesSearch;
  });
  
  // Helper to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Paid
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Overdue
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="mr-1 h-3 w-3" />
            Sent
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Draft
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">{status}</Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Header 
        title="Invoice Management" 
        subtitle="Create and manage blockchain-verified invoices" 
      />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="h-10 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button className="gap-1">
            <Plus className="h-4 w-4 mr-1" />
            New Invoice
          </Button>
        </div>
      </div>
      
      {/* Invoice List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <Card 
              key={invoice.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedInvoice(invoice)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Receipt className="h-5 w-5" />
                  </div>
                  {getStatusBadge(invoice.status)}
                </div>
                <CardTitle className="mt-2 text-lg">{invoice.invoiceNumber}</CardTitle>
                <CardDescription>
                  {invoice.customer.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Issue Date</div>
                    <div>{formatDate(invoice.issueDate)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Due Date</div>
                    <div>{formatDate(invoice.dueDate)}</div>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="text-sm">
                  <div className="text-muted-foreground">Contract</div>
                  <div>
                    {invoice.contractName || 'No associated contract'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-3 w-3" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-3 w-3" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex h-40 items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <div>
              <Receipt className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <h3 className="mt-2 text-lg font-medium">No invoices found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchQuery
                  ? "No invoices match your search query. Try different keywords."
                  : "Get started by creating your first invoice."}
              </p>
              {!searchQuery && (
                <Button className="mt-4 gap-1">
                  <Plus className="h-4 w-4 mr-1" />
                  New Invoice
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-background w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Invoice {selectedInvoice.invoiceNumber}</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedInvoice(null)}
              >
                &times;
              </Button>
            </div>
            
            <div className="p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">INVOICE</h2>
                  <div className="text-lg">{selectedInvoice.invoiceNumber}</div>
                </div>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">From</div>
                  <div className="font-medium">Your Company Name</div>
                  <div className="text-sm">123 Business Street</div>
                  <div className="text-sm">Business City, 12345</div>
                  <div className="text-sm">your@company.com</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Bill To</div>
                  <div className="font-medium">{selectedInvoice.customer.name}</div>
                  <div className="text-sm">Client Address</div>
                  <div className="text-sm">Client City, 12345</div>
                  <div className="text-sm font-mono">
                    {selectedInvoice.customer.wallet}
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Invoice Date</div>
                  <div className="font-medium">{formatDate(selectedInvoice.issueDate)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                  <div className="font-medium">{formatDate(selectedInvoice.dueDate)}</div>
                </div>
                
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                  <div className="font-medium text-xl">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</div>
                </div>
              </div>
              
              <div className="mb-6 rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-right">Qty</th>
                      <th className="px-4 py-2 text-right">Unit Price</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                        <td className="px-4 py-2">{item.description}</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.unitPrice, selectedInvoice.currency)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.quantity * item.unitPrice, selectedInvoice.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-medium">
                      <td colSpan={3} className="px-4 py-2 text-right">Total</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {selectedInvoice.notes && (
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-1">Notes</div>
                  <div className="bg-muted rounded-md p-3 text-sm">{selectedInvoice.notes}</div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                {selectedInvoice.contractId ? (
                  <Button variant="outline" asChild>
                    <a href={`/contracts/${selectedInvoice.contractId}`}>
                      <FileText className="mr-2 h-4 w-4" />
                      View Contract
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" disabled>
                    <FileText className="mr-2 h-4 w-4" />
                    No Contract
                  </Button>
                )}
                
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  
                  {selectedInvoice.status === 'sent' && (
                    <Button>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesPage;