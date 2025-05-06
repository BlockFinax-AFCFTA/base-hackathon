'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import StablecoinWallet from '../components/wallet/StablecoinWallet'
import StablecoinInvoice from '../components/invoice/StablecoinInvoice'
import { Button } from '@/components/ui/button'
import { Info, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const StablecoinDemoPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Base Stablecoin Payments</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple demo application for managing stablecoins on Base Network with cross-border payment capabilities.
          </p>
        </div>
        
        <Alert className="mb-8">
          <Info className="h-4 w-4" />
          <AlertTitle>Test Mode</AlertTitle>
          <AlertDescription>
            This application is in test mode. Connect to Base Network to manage your stablecoins and make payments.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="wallet" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet">Stablecoin Wallet</TabsTrigger>
            <TabsTrigger value="invoice">Invoice Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="mt-4">
            <StablecoinWallet />
          </TabsContent>
          
          <TabsContent value="invoice" className="mt-4">
            <StablecoinInvoice />
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">About Base Network Stablecoins</h2>
          <p className="mb-4">
            Base is an Ethereum L2 built on Optimism's OP Stack, offering scalable and low-cost transactions for stablecoin payments.
            This application demonstrates how to leverage Base for cross-border payments using stablecoins like USDC.
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-1 mb-4">
            <li>Connect to Base Network and manage stablecoin balances</li>
            <li>Send and receive stablecoin payments</li>
            <li>Process invoice payments with USDC, USDT, and DAI</li>
            <li>Track payment history and transactions</li>
            <li>Low-cost, fast cross-border payments</li>
          </ul>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm" asChild>
              <a 
                href="https://docs.base.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center"
              >
                Learn more about Base Network
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StablecoinDemoPage