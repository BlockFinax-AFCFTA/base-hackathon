'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import StablecoinWallet from '../components/wallet/StablecoinWallet'
import EscrowWallet from '../components/wallet/EscrowWallet'
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Shield, Wallet } from 'lucide-react'

export default function WalletPage() {
  return (
    <>
      <Head>
        <title>Blockchain Wallet | Base Network Finance</title>
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
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Wallet Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage your stablecoins and escrow transactions on Base Network
              </p>
            </div>
          </header>
          
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            <Tabs defaultValue="stablecoin" className="space-y-4">
              <TabsList>
                <TabsTrigger value="stablecoin" className="flex items-center">
                  <Wallet className="h-4 w-4 mr-2" />
                  Stablecoin Wallet
                </TabsTrigger>
                <TabsTrigger value="escrow" className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Escrow Wallet
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stablecoin" className="space-y-4">
                <StablecoinWallet />
              </TabsContent>
              
              <TabsContent value="escrow" className="space-y-4">
                <EscrowWallet />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </>
  )
}