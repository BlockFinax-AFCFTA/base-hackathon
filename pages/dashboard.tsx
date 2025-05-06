import React from 'react';
import { Button } from 'client/src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from 'client/src/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'client/src/components/ui/tabs';
import { Building, CreditCard, LineChart, Activity, Globe, ShieldCheck } from 'lucide-react';

// Simple dashboard without external dependencies
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="risk">Risk Intelligence</TabsTrigger>
          <TabsTrigger value="logistics">Logistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="financial" className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Trade Volume */}
            <Card className="bg-blue-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Trade Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">$2.4M USD</p>
                    <p className="text-sm mt-1 flex items-center">
                      <Activity className="h-4 w-4 mr-1" />
                      Global Trade Activity
                    </p>
                  </div>
                  <div className="bg-blue-600 rounded-full p-3">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Trade Deals */}
            <Card className="bg-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Active Trade Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm mt-1">Current Transactions</p>
                  </div>
                  <div className="bg-green-500 rounded-full p-3">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Secured Transactions */}
            <Card className="bg-blue-500 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Secured Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">100%</p>
                    <p className="text-sm mt-1">Smart Contract Protected</p>
                  </div>
                  <div className="bg-blue-400 rounded-full p-3">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Ledger */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Transaction Ledger</CardTitle>
                <Button size="sm" className="bg-blue-700">
                  New Transaction
                </Button>
              </div>
              <CardDescription>Your recent escrow and payments activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Payment to Supplier #{i}</p>
                        <p className="text-sm text-gray-500">Apr {i+10}, 2025</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(i * 10000).toLocaleString()}</p>
                      <div className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 inline-block">
                        Completed
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="risk">
          <Card>
            <CardHeader>
              <CardTitle>Risk Intelligence</CardTitle>
              <CardDescription>Monitor and assess trade-related risks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Risk Score Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center py-8">
                      <div className="relative h-40 w-40">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-2xl font-bold">76/100</div>
                        </div>
                        <div className="h-full w-full rounded-full border-8 border-blue-500"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Risk Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Political Stability', 'Currency Volatility', 'Regulatory Compliance', 'Supply Chain'].map((factor, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span>{factor}</span>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${65 + i*5}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logistics">
          <Card>
            <CardHeader>
              <CardTitle>Logistics Tracking</CardTitle>
              <CardDescription>Monitor your shipments in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-medium">Shipment #{i.toString().padStart(6, '0')}</h3>
                        <p className="text-sm text-gray-500">Container ID: CONT-{i.toString().padStart(6, '0')}</p>
                      </div>
                      <div className="px-3 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                        {i === 1 ? 'In Transit' : i === 2 ? 'Customs Clearance' : 'Delivered'}
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: i === 1 ? '40%' : i === 2 ? '70%' : '100%' }}
                        ></div>
                      </div>
                      <div className="pt-6 flex justify-between text-xs text-gray-500">
                        <span>Origin</span>
                        <span>In Transit</span>
                        <span>Customs</span>
                        <span>Delivery</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}