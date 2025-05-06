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

const StablecoinWallet = () => {
  const { 
    account, 
    isConnected, 
    connectWallet, 
    networkName,
    isBaseNetwork,
    tokens,
    selectedToken,
    selectToken,
    refreshBalances,
    transferTokens,
    ethBalance
  } = useWeb3()
  
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      setIsLoading(true)
      await connectWallet(false) // Use mainnet
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle token selection
  const handleTokenSelect = (tokenAddress: string) => {
    selectToken(tokenAddress)
  }

  // Handle token transfer
  const handleTransfer = async () => {
    if (!amount || !recipient) return
    
    try {
      setIsLoading(true)
      await transferTokens(recipient, amount)
      setAmount('')
      setRecipient('')
      setIsTransferOpen(false)
    } catch (error: any) {
      console.error('Transfer failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle refresh balances
  const handleRefresh = async () => {
    try {
      setIsLoading(true)
      await refreshBalances()
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

  // Render wallet connection UI if not connected
  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Base Network Stablecoin Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to access Base Network stablecoins
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <CreditCard className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-center text-muted-foreground mb-6">
            Connect your Web3 wallet to view your stablecoin balances and make transfers on Base Network.
          </p>
          <Button onClick={handleConnectWallet} disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Show warning if not on Base Network
  const networkWarning = !isBaseNetwork && (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Wrong Network</AlertTitle>
      <AlertDescription>
        Please switch to Base Network in your wallet to access stablecoin features.
      </AlertDescription>
    </Alert>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Base Network Stablecoin Wallet</CardTitle>
            <CardDescription>
              Manage your stablecoins on {networkName}
            </CardDescription>
          </div>
          <Badge variant={isBaseNetwork ? "default" : "destructive"} className="ml-2">
            {networkName || "Unsupported Network"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {networkWarning}
        
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Account:</span>
              <span className="font-mono">{formatAddress(account || '')}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(account || '')}
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
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading || !isBaseNetwork}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsTransferOpen(true)} 
              size="sm" 
              disabled={!isBaseNetwork || tokens.length === 0}
            >
              <Send className="mr-2 h-4 w-4" />
              Send Tokens
            </Button>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tokens">Stablecoins</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tokens" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {tokens.length > 0 ? (
                tokens.map((token) => (
                  <Card key={token.address} className={`cursor-pointer ${selectedToken?.address === token.address ? 'border-primary' : ''}`} onClick={() => handleTokenSelect(token.address)}>
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
                      <p className="text-2xl font-bold">{parseFloat(token.balance).toFixed(4)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Token address: {formatAddress(token.address)}
                      </p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center p-8">
                  <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No Stablecoins Found</h3>
                  <p className="text-muted-foreground mt-2">
                    {isBaseNetwork 
                      ? "You don't have any stablecoins in your wallet yet."
                      : "Please connect to Base Network to view your stablecoins."}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">Transaction History</h3>
              <p className="text-muted-foreground mt-2">
                Coming soon. Transaction history will be available in a future update.
              </p>
              <div className="mt-4">
                <a 
                  href={`${(networkName === BASE_NETWORK.name) 
                    ? BASE_NETWORK.blockExplorer 
                    : BASE_TESTNET.blockExplorer}/address/${account}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary/80"
                >
                  View on Block Explorer
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
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
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
              {selectedToken && (
                <div className="text-xs text-muted-foreground">
                  Available: {parseFloat(selectedToken.balance).toFixed(4)} {selectedToken.symbol}
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
              disabled={!amount || !recipient || isLoading || !selectedToken}
            >
              {isLoading ? 'Sending...' : 'Send Tokens'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default StablecoinWallet