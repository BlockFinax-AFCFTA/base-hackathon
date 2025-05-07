'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Receipt, Plus, Calendar, Clock, DollarSign, CreditCard, FileText, ArrowRight, Printer, PlusCircle, Trash2, Building, User, Link as LinkIcon, Check } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useToast } from '../hooks/use-toast'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

// Mock invoice data
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: Date;
  dueDate: Date;
  customer: {
    name: string;
    wallet: string;
  };
  items: InvoiceItem[];
  total: number;
  currency: string;
  contractId: string | null;
  contractName: string | null;
  paymentLink: string;
  notes: string | null;
}

const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2025-001',
    status: 'paid',
    issueDate: new Date(2025, 3, 1),
    dueDate: new Date(2025, 3, 15),
    customer: {
      name: 'Global Logistics Inc.',
      wallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    },
    items: [
      {
        id: 'item-001',
        description: 'Consultancy Services - April',
        quantity: 1,
        unitPrice: 3000
      },
      {
        id: 'item-002',
        description: 'Implementation Fee',
        quantity: 1,
        unitPrice: 2000
      }
    ],
    total: 5000,
    currency: 'USDC',
    contractId: 'contract-001',
    contractName: 'Supply Chain Agreement',
    paymentLink: 'https://pay.example.com/inv-001',
    notes: 'Payment received via Base Network transfer'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2025-002',
    status: 'sent',
    issueDate: new Date(2025, 4, 5),
    dueDate: new Date(2025, 5, 5),
    customer: {
      name: 'International Payments Ltd.',
      wallet: '0x9e35b23dba3dfae7fbfc3b1f0dfde7b6ae619304'
    },
    items: [
      {
        id: 'item-003',
        description: 'Monthly Service Fee - May',
        quantity: 1,
        unitPrice: 5000
      },
      {
        id: 'item-004',
        description: 'Additional Users (5)',
        quantity: 5,
        unitPrice: 500
      }
    ],
    total: 7500,
    currency: 'USDT',
    contractId: 'contract-002',
    contractName: 'Cross-Border Payment Service',
    paymentLink: 'https://pay.example.com/inv-002',
    notes: null
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2025-003',
    status: 'draft',
    issueDate: new Date(2025, 4, 10),
    dueDate: new Date(2025, 5, 10),
    customer: {
      name: 'Tech Solutions LLC',
      wallet: '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
    },
    items: [
      {
        id: 'item-005',
        description: 'Software Development - Phase 1',
        quantity: 1,
        unitPrice: 8000
      }
    ],
    total: 8000,
    currency: 'USDC',
    contractId: null,
    contractName: null,
    paymentLink: '',
    notes: 'Draft invoice for upcoming project work'
  }
];

// Mock contracts for linking invoices
const mockContracts = [
  { id: 'contract-001', name: 'Supply Chain Agreement' },
  { id: 'contract-002', name: 'Cross-Border Payment Service' },
  { id: 'contract-003', name: 'Equipment Purchase' },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // New invoice form state
  const [newInvoice, setNewInvoice] = useState({
    customer: {
      name: '',
      wallet: ''
    },
    dueDate: '',
    currency: 'USDC',
    contractId: '',
    notes: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }]
  });
  
  // Format currency amount
  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toFixed(2)} ${currency}`;
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customer.')) {
      const field = name.split('.')[1];
      setNewInvoice({
        ...newInvoice,
        customer: {
          ...newInvoice.customer,
          [field]: value
        }
      });
    } else {
      setNewInvoice({
        ...newInvoice,
        [name]: value
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewInvoice({
      ...newInvoice,
      [name]: value
    });
  };
  
  // Handle line item changes
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : Number(value)
    };
    
    setNewInvoice({
      ...newInvoice,
      items: updatedItems
    });
  };
  
  // Add line item
  const addLineItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, unitPrice: 0 }]
    });
  };
  
  // Remove line item
  const removeLineItem = (index: number) => {
    if (newInvoice.items.length > 1) {
      const updatedItems = newInvoice.items.filter((_, i) => i !== index);
      setNewInvoice({
        ...newInvoice,
        items: updatedItems
      });
    }
  };
  
  // Calculate invoice total
  const calculateTotal = (items: { quantity: number, unitPrice: number }[]) => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };
  
  // Handle creating new invoice
  const handleCreateInvoice = async () => {
    // Validate form
    if (!newInvoice.customer.name || !newInvoice.customer.wallet || !newInvoice.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new invoice object
      const invoiceNumber = `INV-2025-${String(invoices.length + 1).padStart(3, '0')}`;
      
      // Find contract name if a contract is selected
      let contractName = null;
      if (newInvoice.contractId) {
        const contract = mockContracts.find(c => c.id === newInvoice.contractId);
        if (contract) {
          contractName = contract.name;
        }
      }
      
      const newInvoiceObject: Invoice = {
        id: `inv-${Date.now().toString(36)}`,
        invoiceNumber,
        status: 'draft',
        issueDate: new Date(),
        dueDate: new Date(newInvoice.dueDate),
        customer: {
          name: newInvoice.customer.name,
          wallet: newInvoice.customer.wallet
        },
        items: newInvoice.items.map((item, index) => ({
          id: `item-${Date.now().toString(36)}-${index}`,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        total: calculateTotal(newInvoice.items),
        currency: newInvoice.currency,
        contractId: newInvoice.contractId || null,
        contractName,
        paymentLink: '',
        notes: newInvoice.notes || null
      };
      
      // Add to invoices list
      setInvoices([newInvoiceObject, ...invoices]);
      
      // Reset form and close dialog
      setNewInvoice({
        customer: {
          name: '',
          wallet: ''
        },
        dueDate: '',
        currency: 'USDC',
        contractId: '',
        notes: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }]
      });
      
      setIsCreateOpen(false);
      
      toast({
        title: "Invoice Created",
        description: `Invoice ${invoiceNumber} has been created as a draft.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // View invoice details
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewOpen(true);
  };
  
  // Get status badge style
  const getStatusBadgeVariant = (status: Invoice['status']): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'paid': return 'default';
      case 'sent': return 'secondary';
      case 'draft': return 'outline';
      case 'overdue': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };
  
  // Filter invoices based on active tab
  const filteredInvoices = invoices.filter(invoice => {
    if (activeTab === 'all') return true;
    return invoice.status === activeTab;
  });
  
  return (
    <>
      <Head>
        <title>Invoices | Base Network Finance</title>
      </Head>
      
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="font-semibold">Base Network Finance</div>
          </div>
          <BlockchainSidebar className="flex-1" />
        </div>
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 lg:gap-6 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Stablecoin Invoicing</h1>
                <p className="text-sm text-muted-foreground">
                  Create and manage stablecoin invoices
                </p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </div>
          </header>
          
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.length > 0 ? (
                        filteredInvoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                            <TableCell>{invoice.customer.name}</TableCell>
                            <TableCell>{format(invoice.issueDate, 'PP')}</TableCell>
                            <TableCell>{format(invoice.dueDate, 'PP')}</TableCell>
                            <TableCell>
                              {formatCurrency(invoice.total, invoice.currency)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(invoice.status)}>
                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewInvoice(invoice)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                            No invoices found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      {/* Create Invoice Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Receipt className="mr-2 h-5 w-5" />
              Create New Invoice
            </DialogTitle>
            <DialogDescription>
              Create an invoice to be paid in stablecoins on Base Network
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Customer Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer.name">Customer Name</Label>
                    <Input
                      id="customer.name"
                      name="customer.name"
                      value={newInvoice.customer.name}
                      onChange={handleInputChange}
                      placeholder="ABC Corporation"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="customer.wallet">Wallet Address</Label>
                    <Input
                      id="customer.wallet"
                      name="customer.wallet"
                      value={newInvoice.customer.wallet}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      The customer's wallet address for payment
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-4 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Invoice Details
                </h3>
                
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={newInvoice.currency}
                      onValueChange={(value) => handleSelectChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="USDT">USDT</SelectItem>
                        <SelectItem value="DAI">DAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="contractId">Link to Contract (Optional)</Label>
                    <Select
                      value={newInvoice.contractId}
                      onValueChange={(value) => handleSelectChange('contractId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contract (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {mockContracts.map(contract => (
                          <SelectItem key={contract.id} value={contract.id}>
                            {contract.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-md font-medium mb-4 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Line Items
              </h3>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Description</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {newInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.quantity * item.unitPrice, newInvoice.currency)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLineItem(index)}
                            disabled={newInvoice.items.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-2 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                  className="mt-2"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-xl font-bold">
                    {formatCurrency(
                      calculateTotal(newInvoice.items),
                      newInvoice.currency
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                value={newInvoice.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or payment instructions"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateInvoice} 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Invoice Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <DialogTitle className="flex items-center text-xl">
                      <Receipt className="mr-2 h-5 w-5" />
                      Invoice {selectedInvoice.invoiceNumber}
                    </DialogTitle>
                    <DialogDescription>
                      {format(selectedInvoice.issueDate, 'PPP')}
                    </DialogDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(selectedInvoice.status)}>
                    {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                  </Badge>
                </div>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">From</h3>
                  <p className="font-medium">Your Company Name</p>
                  <p className="text-sm mt-1 font-mono">0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Bill To</h3>
                  <p className="font-medium">{selectedInvoice.customer.name}</p>
                  <p className="text-sm mt-1 font-mono">{selectedInvoice.customer.wallet}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Issue Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <p>{format(selectedInvoice.issueDate, 'PP')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Due Date
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <p>{format(selectedInvoice.dueDate, 'PP')}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Amount Due
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-0">
                    <p className="font-bold">{formatCurrency(selectedInvoice.total, selectedInvoice.currency)}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-3">Invoice Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.description}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.unitPrice, selectedInvoice.currency)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.quantity * item.unitPrice, selectedInvoice.currency)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(selectedInvoice.total, selectedInvoice.currency)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {selectedInvoice.notes && (
                <div className="bg-muted/50 p-3 rounded-md mt-6">
                  <h3 className="text-sm font-medium mb-1">Notes</h3>
                  <p className="text-sm">{selectedInvoice.notes}</p>
                </div>
              )}
              
              {selectedInvoice.contractId && (
                <div className="mt-4">
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Linked to contract: </span>
                    <Badge variant="outline" className="ml-2">{selectedInvoice.contractName}</Badge>
                  </div>
                </div>
              )}
              
              <DialogFooter className="sm:justify-between mt-6">
                <div className="hidden sm:flex gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
                <div className="flex gap-2">
                  {selectedInvoice.status === 'draft' && (
                    <Button size="sm">
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Send Invoice
                    </Button>
                  )}
                  
                  {selectedInvoice.status === 'sent' && (
                    <Button size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}