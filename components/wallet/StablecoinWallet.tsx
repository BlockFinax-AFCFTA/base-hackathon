'use client'

import { useState } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../ui/card'
import EscrowWallet from './EscrowWallet'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
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
  CreditCard, 
  RefreshCw, 
  Send, 
  Plus, 
  Check, 
  AlertCircle, 
  ExternalLink,
  Copy
} from 'lucide-react'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { BASE_NETWORK, BASE_TESTNET } from '../../client/src/services/web3Service'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Badge } from '../ui/badge'
import { useToast } from '../../hooks/use-toast'

// Simulated token data for Base Network - in a real app this would come from an API
const mockTokenData = [
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    decimals: 6,
    balance: "150.00"
  },
  {
    name: "Tether USD",
    symbol: "USDT",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 6,
    balance: "250.00"
  },
  {
    name: "Dai Stablecoin",
    symbol: "DAI",
    address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",
    decimals: 18,
    balance: "75.00"
  }
];

const StablecoinWallet = () => {
  // Mock wallet data
  const [walletAddress, setWalletAddress] = useState<string>("0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb")
  const [tokens, setTokens] = useState(mockTokenData)
  const [selectedToken, setSelectedToken] = useState(mockTokenData[0])
  const [ethBalance, setEthBalance] = useState("0.25")
  
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  // Handle token selection
  const handleTokenSelect = (tokenAddress: string) => {
    const token = tokens.find(t => t.address === tokenAddress)
    if (token) {
      setSelectedToken(token)
    }
  }

  // Handle token transfer
  const handleTransfer = async () => {
    if (!amount || !recipient) return
    
    try {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update token balance
      const numAmount = parseFloat(amount)
      setTokens(tokens.map(token => 
        token.address === selectedToken.address 
          ? { ...token, balance: (parseFloat(token.balance) - numAmount).toFixed(2) }
          : token
      ))
      
      // Clear form and close dialog
      setAmount('')
      setRecipient('')
      setIsTransferOpen(false)
      
      // Show success message
      toast({
        title: "Transfer Successful",
        description: `${amount} ${selectedToken.symbol} was sent to ${formatAddress(recipient)}`,
      })
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: "There was an error processing your transfer",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle refresh balances
  const handleRefresh = async () => {
    try {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Balances Updated",
        description: "Your token balances have been refreshed.",
      })
    } catch (error) {
      console.error('Failed to refresh balances:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Copy address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Address Copied",
      description: "Address copied to clipboard",
    })
  }

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Base Network Stablecoin Wallet</CardTitle>
              <CardDescription>
                Manage your stablecoins on Base Network
              </CardDescription>
            </div>
            <Badge variant="default" className="ml-2">
              Base Network
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Your Wallet:</span>
                <span className="font-mono">{formatAddress(walletAddress)}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard(walletAddress)}
                  className="h-6 w-6"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                ETH Balance: {parseFloat(ethBalance).toFixed(4)} ETH
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button 
                onClick={() => setIsTransferOpen(true)} 
                size="sm" 
                disabled={tokens.length === 0}
              >
                <Send className="mr-2 h-4 w-4" />
                Send Tokens
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <Tabs defaultValue="tokens" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tokens">Stablecoins</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="escrow">Escrow Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tokens" className="p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {tokens.map((token) => (
                  <Card 
                    key={token.address} 
                    className={`cursor-pointer ${selectedToken?.address === token.address ? 'border-primary' : 'border-muted'}`} 
                    onClick={() => handleTokenSelect(token.address)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-lg">{token.symbol}</CardTitle>
                          <CardDescription>{token.name}</CardDescription>
                        </div>
                        {selectedToken?.address === token.address && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-2xl font-bold">{parseFloat(token.balance).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Token address: {formatAddress(token.address)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              <div className="border rounded-md overflow-hidden mt-4">
                <div className="bg-muted p-3 font-medium grid grid-cols-12 gap-4">
                  <div className="col-span-3">Date</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-3">Amount</div>
                  <div className="col-span-3">Status</div>
                </div>
                <Separator />
                <div className="p-8 text-center">
                  <h3 className="text-lg font-medium">No Recent Transactions</h3>
                  <p className="text-muted-foreground mt-2">
                    Your transactions will appear here once you start using your wallet.
                  </p>
                  <div className="mt-4">
                    <a 
                      href={`${BASE_NETWORK.blockExplorer}/address/${walletAddress}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      View on Base Explorer
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="escrow">
              <div className="mt-4">
                <EscrowWallet />
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6" />
          
          <div className="bg-muted/40 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Add Tokens to Your Wallet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              This is your Base Network wallet built directly into the application. No external wallet connection required.
            </p>
            <Button variant="outline" disabled={true}>
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Token
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send {selectedToken?.symbol}</DialogTitle>
            <DialogDescription>
              Transfer stablecoins to another wallet address
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Select
                value={selectedToken?.address}
                onValueChange={handleTokenSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol} - Balance: {parseFloat(token.balance).toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={selectedToken ? parseFloat(selectedToken.balance) : 0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {selectedToken && (
                <div className="text-xs text-muted-foreground">
                  Available: {parseFloat(selectedToken.balance).toFixed(2)} {selectedToken.symbol}
                </div>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer} 
              disabled={
                !amount || 
                !recipient || 
                isLoading || 
                !selectedToken ||
                (selectedToken && parseFloat(amount) > parseFloat(selectedToken.balance))
              }
            >
              {isLoading ? 'Sending...' : 'Send Tokens'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StablecoinWallet