'use client'

import { useState, useEffect } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { useToast } from '../../hooks/use-toast'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Plus,
  Download,
  CreditCard,
  Check,
  AlertTriangle,
  Trash,
  Edit,
  Search,
  RefreshCw
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Badge } from '../ui/badge'
import { format, addDays } from 'date-fns'

// Interfaces
interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  amount: string
  currency: string
  status: 'PENDING' | 'PAID' | 'OVERDUE'
  items: InvoiceItem[]
  recipient: {
    name: string
    address: string
  }
  notes?: string
}

// Demo invoices
const mockInvoices: Invoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2025-001',
    issueDate: new Date(),
    dueDate: addDays(new Date(), 30),
    amount: '1500.00',
    currency: 'USDC',
    status: 'PENDING',
    items: [
      {
        description: 'Cross-border shipping fee',
        quantity: 1,
        unitPrice: 1000,
        totalPrice: 1000
      },
      {
        description: 'Import documentation',
        quantity: 5,
        unitPrice: 100,
        totalPrice: 500
      }
    ],
    recipient: {
      name: 'Global Trade Solutions Inc.',
      address: '0x0f9e5750AEA5F2704849976BE9aDdc25b0d90388'
    },
    notes: 'Payment for international shipping services'
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2025-002',
    issueDate: addDays(new Date(), -15),
    dueDate: addDays(new Date(), 15),
    amount: '2750.00',
    currency: 'USDT',
    status: 'PENDING',
    items: [
      {
        description: 'API Integration Services',
        quantity: 25,
        unitPrice: 100,
        totalPrice: 2500
      },
      {
        description: 'Third-party service fees',
        quantity: 1,
        unitPrice: 250,
        totalPrice: 250
      }
    ],
    recipient: {
      name: 'TechConnect Solutions',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    },
    notes: 'Integration work completed on May 1st'
  }
]

// Invoice Detail View Component
const InvoiceDetail = ({ 
  invoice,
  onGoBack,
  onPay
}: { 
  invoice: Invoice, 
  onGoBack: () => void,
  onPay: (invoice: Invoice) => void
}) => {
  const { isConnected, isBaseNetwork } = useWeb3()
  
  // Format currency amount
  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount
    return value.toFixed(2)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onGoBack}
                className="font-medium"
              >
                ← Back to Invoices
              </Button>
            </div>
            <CardTitle className="text-2xl">Invoice #{invoice.invoiceNumber}</CardTitle>
            <CardDescription>
              Issue Date: {format(invoice.issueDate, 'PPP')}
            </CardDescription>
          </div>
          <Badge 
            variant={
              invoice.status === 'PAID' ? 'default' : 
              invoice.status === 'OVERDUE' ? 'destructive' : 'outline'
            }
          >
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Issue Date:</span>
                <span>{format(invoice.issueDate, 'PPP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span>{format(invoice.dueDate, 'PPP')}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Currency:</span>
                <span>{invoice.currency}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(invoice.amount)} {invoice.currency}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Recipient Information
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{invoice.recipient.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Wallet Address:</span>
                <p className="font-mono text-xs break-all">{invoice.recipient.address}</p>
              </div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Invoice Items</h3>
          <div className="border rounded-lg">
            <div className="grid grid-cols-12 gap-2 p-3 font-medium bg-muted">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-right">Quantity</div>
              <div className="col-span-2 text-right">Unit Price</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            <Separator />
            {invoice.items.map((item, index) => (
              <div key={index}>
                <div className="grid grid-cols-12 gap-2 p-3">
                  <div className="col-span-6">{item.description}</div>
                  <div className="col-span-2 text-right">{item.quantity}</div>
                  <div className="col-span-2 text-right">${formatCurrency(item.unitPrice)}</div>
                  <div className="col-span-2 text-right font-medium">${formatCurrency(item.totalPrice)}</div>
                </div>
                {index < invoice.items.length - 1 && <Separator />}
              </div>
            ))}
            <Separator />
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted">
              <div className="col-span-10 text-right font-bold">Total:</div>
              <div className="col-span-2 text-right font-bold">${formatCurrency(invoice.amount)}</div>
            </div>
          </div>
        </div>
        
        {invoice.notes && (
          <>
            <Separator className="my-6" />
            <div>
              <h3 className="text-lg font-medium mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{invoice.notes}</p>
            </div>
          </>
        )}
        
        {!isConnected && (
          <Alert className="mt-6">
            <AlertTitle>Connect your wallet to pay this invoice</AlertTitle>
            <AlertDescription>
              You need to connect your wallet to pay this invoice with {invoice.currency} stablecoin.
            </AlertDescription>
          </Alert>
        )}
        
        {isConnected && !isBaseNetwork && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Network Error</AlertTitle>
            <AlertDescription>
              Please switch to the correct network in your wallet to pay this invoice.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        
        {invoice.status !== 'PAID' && (
          <Button 
            onClick={() => onPay(invoice)}
            disabled={!isConnected || !isBaseNetwork}
            className="w-full sm:w-auto"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Pay Invoice
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

// Invoice List Component
const InvoiceList = ({ 
  invoices, 
  onViewInvoice, 
  onCreateInvoice,
  onDeleteInvoice
}: { 
  invoices: Invoice[], 
  onViewInvoice: (invoice: Invoice) => void,
  onCreateInvoice: () => void,
  onDeleteInvoice: (invoiceId: string) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.recipient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onCreateInvoice}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>
      
      <div className="border rounded-md">
        <div className="grid grid-cols-12 gap-3 p-4 font-medium bg-muted">
          <div className="col-span-3">Invoice #</div>
          <div className="col-span-3">Recipient</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <Separator />
        
        {filteredInvoices.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No invoices found. Create your first invoice to get started.</p>
          </div>
        ) : (
          filteredInvoices.map((invoice, index) => (
            <div key={invoice.id}>
              <div className="grid grid-cols-12 gap-3 p-4 hover:bg-muted/30 transition-colors">
                <div className="col-span-3 font-medium">{invoice.invoiceNumber}</div>
                <div className="col-span-3">{invoice.recipient.name}</div>
                <div className="col-span-2">{parseFloat(invoice.amount).toFixed(2)} {invoice.currency}</div>
                <div className="col-span-2">
                  <Badge 
                    variant={
                      invoice.status === 'PAID' ? 'default' : 
                      invoice.status === 'OVERDUE' ? 'destructive' : 'outline'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onViewInvoice(invoice)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDeleteInvoice(invoice.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {index < filteredInvoices.length - 1 && <Separator />}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Create Invoice Form Component
const CreateInvoiceForm = ({
  onCancel,
  onSubmit
}: {
  onCancel: () => void,
  onSubmit: (invoice: Invoice) => void
}) => {
  const [recipientName, setRecipientName] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [currency, setCurrency] = useState('USDC')
  const [dueDate, setDueDate] = useState<string>(format(addDays(new Date(), 30), 'yyyy-MM-dd'))
  const [notes, setNotes] = useState('')
  
  // Invoice items
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ])
  
  // Add a new empty item
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }])
  }
  
  // Remove an item at specific index
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }
  
  // Update item at specific index
  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    
    // Update the specific field
    if (field === 'description') {
      newItems[index].description = value as string
    } else if (field === 'quantity' || field === 'unitPrice') {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
      newItems[index][field] = numValue
      
      // Recalculate total price
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice
    }
    
    setItems(newItems)
  }
  
  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0)
  
  // Create and submit the invoice
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!recipientName || !recipientAddress || items.some(item => !item.description)) {
      return
    }
    
    // Create invoice object
    const newInvoice: Invoice = {
      id: `inv-${Date.now().toString(36)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      issueDate: new Date(),
      dueDate: new Date(dueDate),
      amount: totalAmount.toString(),
      currency,
      status: 'PENDING',
      items,
      recipient: {
        name: recipientName,
        address: recipientAddress
      },
      notes
    }
    
    onSubmit(newInvoice)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recipient Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Company or individual name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Wallet Address</Label>
              <Input
                id="recipientAddress"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Invoice Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Invoice Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
          
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label htmlFor={`item-${index}-desc`}>Description</Label>
                  <Input
                    id={`item-${index}-desc`}
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Service or product"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`item-${index}-qty`}>Quantity</Label>
                  <Input
                    id={`item-${index}-qty`}
                    type="number"
                    min="1"
                    step="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`item-${index}-price`}>Unit Price</Label>
                  <Input
                    id={`item-${index}-price`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`item-${index}-total`}>Total</Label>
                  <Input
                    id={`item-${index}-total`}
                    value={item.totalPrice.toFixed(2)}
                    disabled
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <div className="bg-muted w-full md:w-64 p-4 rounded-lg">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${totalAmount.toFixed(2)} {currency}</span>
              </div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional information or payment instructions"
            rows={3}
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Create Invoice
          </Button>
        </div>
      </div>
    </form>
  )
}

// Payment Dialog Component
const PaymentDialog = ({
  invoice,
  isOpen,
  onClose,
  onComplete
}: {
  invoice: Invoice,
  isOpen: boolean,
  onClose: () => void,
  onComplete: (invoice: Invoice) => void
}) => {
  const { 
    tokens,
    selectedToken,
    selectToken,
    transferTokens,
  } = useWeb3()
  
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  
  // Handle invoice payment
  const handlePayInvoice = async () => {
    if (!selectedToken) {
      toast({
        title: 'Payment Error',
        description: 'Please select a token',
        variant: 'destructive'
      })
      return
    }
    
    try {
      setIsLoading(true)
      
      // Make the transfer
      await transferTokens(
        invoice.recipient.address,
        invoice.amount
      )
      
      setPaymentComplete(true)
      
      toast({
        title: 'Payment Successful',
        description: `You've paid ${invoice.amount} ${selectedToken.symbol} for invoice ${invoice.invoiceNumber}`,
      })
      
      // Mark invoice as paid
      const updatedInvoice = {
        ...invoice,
        status: 'PAID' as const
      }
      
      // Close payment modal after a delay and update invoice status
      setTimeout(() => {
        onComplete(updatedInvoice)
        setPaymentComplete(false)
        onClose()
      }, 2000)
      
    } catch (error: any) {
      toast({
        title: 'Payment Failed',
        description: error.message || 'There was an error processing your payment',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Format currency amount
  const formatCurrency = (amount: string | number) => {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount
    return value.toFixed(2)
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Invoice #{invoice.invoiceNumber}</DialogTitle>
          <DialogDescription>
            Make a payment using a stablecoin on BlockFinaX
          </DialogDescription>
        </DialogHeader>
        
        {paymentComplete ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Payment Complete!</h3>
            <p className="text-center text-muted-foreground">
              Your payment of {formatCurrency(invoice.amount)} {selectedToken?.symbol} has been processed successfully.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="token">Select Token</Label>
                <Select
                  value={selectedToken?.address}
                  onValueChange={(value) => selectToken(value)}
                >
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {tokens && tokens.length > 0 ? (
                      tokens.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.symbol} - Balance: {parseFloat(token.balance).toFixed(4)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-tokens" disabled>
                        No tokens available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="text"
                  value={formatCurrency(invoice.amount)}
                  disabled
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  type="text"
                  value={invoice.recipient.address}
                  disabled
                />
              </div>
              
              {selectedToken && parseFloat(selectedToken.balance) < parseFloat(invoice.amount) && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Insufficient Balance</AlertTitle>
                  <AlertDescription>
                    You don't have enough {selectedToken.symbol} to pay this invoice.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handlePayInvoice} 
                disabled={
                  isLoading || 
                  !selectedToken || 
                  (selectedToken && parseFloat(selectedToken.balance) < parseFloat(invoice.amount))
                }
              >
                {isLoading ? 'Processing...' : `Pay ${formatCurrency(invoice.amount)} ${selectedToken?.symbol || ''}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Main Component
const StablecoinInvoice = () => {
  const { isConnected, connectWallet } = useWeb3()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'create'>('list')
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)
      await connectWallet()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // View a specific invoice
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setViewMode('detail')
  }
  
  // Go back to list view
  const handleBackToList = () => {
    setSelectedInvoice(null)
    setViewMode('list')
  }
  
  // Delete an invoice
  const handleDeleteInvoice = (invoiceId: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId))
    toast({
      title: 'Invoice Deleted',
      description: 'The invoice has been deleted successfully.'
    })
  }
  
  // Go to create invoice form
  const handleCreateInvoiceClick = () => {
    setViewMode('create')
  }
  
  // Handle create invoice form submission
  const handleCreateInvoice = (newInvoice: Invoice) => {
    setInvoices([newInvoice, ...invoices])
    setViewMode('list')
    toast({
      title: 'Invoice Created',
      description: `Invoice #${newInvoice.invoiceNumber} has been created successfully.`
    })
  }
  
  // Open payment dialog
  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsPaymentOpen(true)
  }
  
  // Handle payment completion
  const handlePaymentComplete = (paidInvoice: Invoice) => {
    // Update the invoice in the list
    setInvoices(invoices.map(inv => 
      inv.id === paidInvoice.id ? paidInvoice : inv
    ))
    
    // Update selected invoice if it's currently being viewed
    if (selectedInvoice && selectedInvoice.id === paidInvoice.id) {
      setSelectedInvoice(paidInvoice)
    }
  }
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Stablecoin Invoices</h1>
            <p className="text-muted-foreground">Create and manage invoices payable with stablecoins on BlockFinaX</p>
          </div>
        </div>
      </div>
      
      {viewMode === 'list' && (
        <InvoiceList 
          invoices={invoices} 
          onViewInvoice={handleViewInvoice}
          onCreateInvoice={handleCreateInvoiceClick}
          onDeleteInvoice={handleDeleteInvoice}
        />
      )}
      
      {viewMode === 'detail' && selectedInvoice && (
        <InvoiceDetail 
          invoice={selectedInvoice} 
          onGoBack={handleBackToList}
          onPay={handlePayInvoice}
        />
      )}
      
      {viewMode === 'create' && (
        <>
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="font-medium"
            >
              ← Back to Invoices
            </Button>
            <h2 className="text-xl font-bold ml-4">Create New Invoice</h2>
          </div>
          <CreateInvoiceForm 
            onCancel={handleBackToList}
            onSubmit={handleCreateInvoice}
          />
        </>
      )}
      
      {selectedInvoice && (
        <PaymentDialog 
          invoice={selectedInvoice}
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}

export default StablecoinInvoice