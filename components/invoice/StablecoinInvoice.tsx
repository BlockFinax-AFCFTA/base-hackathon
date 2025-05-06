'use client'

import { useState } from 'react'
import { useWeb3 } from '@/hooks/useWeb3'
import { useToast } from '@/hooks/use-toast'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Send,
  Download,
  CreditCard,
  Check,
  AlertTriangle
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

// Mock invoice data for demonstration
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
}

const mockInvoice: Invoice = {
  id: 'inv-001',
  invoiceNumber: 'INV-2025-001',
  issueDate: new Date(),
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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
    address: '0x0f9e5750AEA5F2704849976BE9aDdc25b0d90388' // Example Base wallet address
  }
}

const StablecoinInvoice = () => {
  const { 
    account, 
    isConnected, 
    connectWallet,
    tokens,
    selectedToken,
    selectToken,
    transferTokens,
    isBaseNetwork
  } = useWeb3()
  
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [invoice, setInvoice] = useState<Invoice>(mockInvoice)
  
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
  
  // Handle invoice payment
  const handlePayInvoice = async () => {
    if (!isConnected || !selectedToken) {
      toast({
        title: 'Payment Error',
        description: 'Please connect your wallet and select a token',
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
      
      // Update invoice status
      setInvoice({
        ...invoice,
        status: 'PAID'
      })
      
      setPaymentComplete(true)
      
      toast({
        title: 'Payment Successful',
        description: `You've paid ${invoice.amount} ${selectedToken.symbol} for invoice ${invoice.invoiceNumber}`,
      })
      
      // Close payment modal after a delay
      setTimeout(() => {
        setIsPaymentOpen(false)
        setPaymentComplete(false)
      }, 3000)
      
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
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
              Please switch to Base Network in your wallet to pay this invoice.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        
        {!isConnected ? (
          <Button onClick={handleConnectWallet} disabled={isLoading} className="w-full sm:w-auto">
            <CreditCard className="mr-2 h-4 w-4" />
            {isLoading ? 'Connecting...' : 'Connect Wallet to Pay'}
          </Button>
        ) : (
          <Button 
            onClick={() => setIsPaymentOpen(true)}
            disabled={isLoading || !isBaseNetwork || invoice.status === 'PAID'}
            className="w-full sm:w-auto"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {invoice.status === 'PAID' ? 'Paid' : 'Pay Invoice'}
          </Button>
        )}
      </CardFooter>
      
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay Invoice #{invoice.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Make a payment using a stablecoin on Base Network
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
                      {tokens.map((token) => (
                        <SelectItem key={token.address} value={token.address}>
                          {token.symbol} - Balance: {parseFloat(token.balance).toFixed(4)}
                        </SelectItem>
                      ))}
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
                <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
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
    </Card>
  )
}

export default StablecoinInvoice