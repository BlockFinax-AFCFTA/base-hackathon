'use client'

import { useState } from 'react'
import { useWeb3 } from '@/hooks/useWeb3'
import { useWallet } from '@/hooks/useWallet'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet as WalletIcon, 
  RefreshCw, 
  Plus,
  CreditCard,
  ArrowLeftRight,
  Download,
  Upload,
  Search
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function WalletPage() {
  const { user } = useWeb3()
  const { wallets, transactions, isLoading, deposit, withdraw } = useWallet(user?.id)
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [txTypeFilter, setTxTypeFilter] = useState('all')
  const [amount, setAmount] = useState('')
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false)
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get the main wallet
  const mainWallet = wallets?.find(wallet => wallet.walletType === 'MAIN')
  
  // Format currency
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(value))
  }
  
  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  
  // Handle deposit
  const handleDeposit = async () => {
    if (!mainWallet) return
    
    try {
      setIsProcessing(true)
      await deposit(mainWallet.id, amount)
      toast({
        title: 'Deposit successful',
        description: `${formatCurrency(amount)} has been added to your wallet.`,
      })
      setIsDepositDialogOpen(false)
      setAmount('')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Deposit failed',
        description: error instanceof Error ? error.message : 'Failed to deposit funds',
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Handle withdraw
  const handleWithdraw = async () => {
    if (!mainWallet) return
    
    try {
      setIsProcessing(true)
      await withdraw(mainWallet.id, amount)
      toast({
        title: 'Withdrawal successful',
        description: `${formatCurrency(amount)} has been withdrawn from your wallet.`,
      })
      setIsWithdrawDialogOpen(false)
      setAmount('')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Withdrawal failed',
        description: error instanceof Error ? error.message : 'Failed to withdraw funds',
      })
    } finally {
      setIsProcessing(false)
    }
  }
  
  // Filter transactions
  const filteredTransactions = transactions?.filter(tx => {
    // Search filter
    const searchMatch = 
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toString().includes(searchTerm)
    
    // Type filter
    const typeMatch = txTypeFilter === 'all' || tx.txType === txTypeFilter
    
    return searchMatch && typeMatch
  }) || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Wallet</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Wallet
          </Button>
        </div>
      </div>
      
      {/* Wallet Balance Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Balance</CardTitle>
          <CardDescription>Your main wallet balance and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-primary/10 p-4 rounded-full mr-4">
                <WalletIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Main Wallet</p>
                <p className="text-3xl font-bold">
                  {mainWallet ? formatCurrency(mainWallet.balance) : '$0.00'}
                </p>
                <p className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Download className="mr-2 h-4 w-4" /> Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                    <DialogDescription>
                      Add funds to your main wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Amount (USD)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)} disabled={isProcessing}>
                      Cancel
                    </Button>
                    <Button onClick={handleDeposit} disabled={!amount || isProcessing}>
                      {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      Deposit Funds
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Upload className="mr-2 h-4 w-4" /> Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                      Withdraw funds from your main wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-amount">Amount (USD)</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      {mainWallet && (
                        <p className="text-xs text-gray-500">
                          Available balance: {formatCurrency(mainWallet.balance)}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)} disabled={isProcessing}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleWithdraw} 
                      disabled={!amount || isProcessing || (mainWallet && parseFloat(amount) > parseFloat(mainWallet.balance))}
                    >
                      {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                      Withdraw Funds
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeftRight className="mr-2 h-4 w-4" /> Transfer
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Transfer Funds</DialogTitle>
                    <DialogDescription>
                      Transfer funds to another wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-gray-500">Coming soon...</p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>View all your wallet transactions</CardDescription>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={txTypeFilter} onValueChange={setTxTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="DEPOSIT">Deposits</SelectItem>
                <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                <SelectItem value="TRANSFER">Transfers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading transactions...</div>
          ) : filteredTransactions.length > 0 ? (
            <Table>
              <TableCaption>A list of your recent transactions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-2 ${
                          tx.txType === 'DEPOSIT' ? 'bg-green-100' : 
                          tx.txType === 'WITHDRAWAL' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {tx.txType === 'DEPOSIT' ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                          ) : tx.txType === 'WITHDRAWAL' ? (
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArrowLeftRight className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        {tx.txType}
                      </div>
                    </TableCell>
                    <TableCell>{tx.description || tx.txType}</TableCell>
                    <TableCell>{formatDate(tx.createdAt)}</TableCell>
                    <TableCell className={`text-right ${
                      tx.txType === 'DEPOSIT' ? 'text-green-600' : 
                      tx.txType === 'WITHDRAWAL' ? 'text-red-600' : ''
                    }`}>
                      {tx.txType === 'DEPOSIT' ? '+' : tx.txType === 'WITHDRAWAL' ? '-' : ''}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        tx.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {tx.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your transaction history will appear here
              </p>
              <Button onClick={() => setIsDepositDialogOpen(true)}>
                Make Your First Transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}