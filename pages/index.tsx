'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '../components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { useWeb3 } from '../hooks/useWeb3'
import { 
  Wallet, 
  DollarSign, 
  FileText, 
  ArrowRight,
  Globe,
  FileSpreadsheet,
  Receipt,
} from 'lucide-react'
import { useToast } from '../hooks/use-toast'

export default function Home() {
  const { isConnected, connectWallet } = useWeb3()
  const { toast } = useToast()
  const [isConnecting, setIsConnecting] = useState(false)
  
  const handleConnectWallet = async () => {
    try {
      setIsConnecting(true)
      await connectWallet()
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Base Network Finance Platform</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A complete blockchain solution with integrated wallet, contracts, documents, and invoicing
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button asChild size="lg">
            <Link href="/wallet">
              Launch Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardHeader>
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Base Network Wallet</CardTitle>
            <CardDescription>
              Integrated stablecoin management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Our wallet supports USDC, USDT, and DAI on Base Network, built directly into the application. No external wallet connection required.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/wallet">Open Wallet</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Smart Contracts</CardTitle>
            <CardDescription>
              Blockchain-secured agreements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Create and manage smart contracts with counterparties for secure business relationships and escrow payments.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/contracts">View Contracts</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Document Management</CardTitle>
            <CardDescription>
              Blockchain-verified documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Upload, store, and verify important business documents using blockchain technology for tamper-proof records.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/documents">Manage Documents</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Stablecoin Invoicing</CardTitle>
            <CardDescription>
              Digital payments and tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Create, send, and manage invoices to be paid in stablecoins on Base Network with automatic tracking and verification.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href="/invoices">View Invoices</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="bg-muted p-8 rounded-lg">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-6 md:mb-0 md:mr-8">
            <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
              <Globe className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Why Base Network?</h2>
            <p className="text-muted-foreground mb-4">
              Base is an Ethereum L2 built to bring the next billion users to onchain applications. With high throughput, low transaction costs, and Ethereum security guarantees, Base is the perfect network for stablecoin payments and cross-border transfers.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-background rounded-md px-4 py-2 flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground">Fast Transactions</span>
              </div>
              <div className="bg-background rounded-md px-4 py-2 flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground">Low Fees</span>
              </div>
              <div className="bg-background rounded-md px-4 py-2 flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground">Ethereum Security</span>
              </div>
              <div className="bg-background rounded-md px-4 py-2 flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-muted-foreground">Global Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}