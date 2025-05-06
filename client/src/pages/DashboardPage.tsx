import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, CreditCard, LineChart, Activity, Globe, ShieldCheck, BookOpen, Scale, BarChart3, ShoppingBag, Search } from 'lucide-react';

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
          <TabsTrigger value="regulatory">Regulatory AI</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
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

        <TabsContent value="regulatory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-blue-600" />
                Regulatory AI Assistant
              </CardTitle>
              <CardDescription>Export compliance guidance and regulatory updates for international trade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Card className="border-blue-100">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">AfCFTA Compliance Check</CardTitle>
                    <CardDescription>Verify if your products qualify for duty-free treatment under AfCFTA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Rules of Origin Analyzer</p>
                            <p className="text-sm text-gray-500">Check product qualification status</p>
                          </div>
                        </div>
                        <Button size="sm">
                          Check Products
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Tariff Calculator</p>
                            <p className="text-sm text-gray-500">Calculate potential duty savings</p>
                          </div>
                        </div>
                        <Button size="sm">
                          Calculate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Regulatory Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        'AfCFTA Digital Trade Protocol enters force - May 1, 2025',
                        'New certificate of origin requirements for agricultural products',
                        'Updated customs declaration procedures for cross-border e-commerce',
                        'Harmonized standards for digital payments within African Union'
                      ].map((update, i) => (
                        <div key={i} className="flex items-center p-2 border-b last:border-0">
                          <div className="flex-1">
                            <p className="text-sm">{update}</p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                African Marketplace
              </CardTitle>
              <CardDescription>Discover and trade products across the African continent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex justify-between mb-6">
                  <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search for products or suppliers..."
                      className="pl-10 pr-4 py-2 w-full border rounded-md"
                    />
                  </div>
                  <Button>
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    List Product
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Premium Coffee Beans',
                      origin: 'Ethiopia',
                      price: '$4.50/kg',
                      category: 'Agriculture',
                      image: 'bg-amber-100',
                      iconColor: 'text-amber-600'
                    },
                    {
                      title: 'Handwoven Textiles',
                      origin: 'Ghana',
                      price: '$12.25/unit',
                      category: 'Handicrafts',
                      image: 'bg-indigo-100',
                      iconColor: 'text-indigo-600'
                    },
                    {
                      title: 'Natural Shea Butter',
                      origin: 'Nigeria',
                      price: '$7.80/kg',
                      category: 'Cosmetics',
                      image: 'bg-green-100',
                      iconColor: 'text-green-600'
                    }
                  ].map((product, i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className={`${product.image} h-40 flex items-center justify-center`}>
                        <ShoppingBag className={`h-12 w-12 ${product.iconColor}`} />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">{product.title}</h3>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-gray-600">Origin: {product.origin}</span>
                          <span className="text-sm font-medium">{product.price}</span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {product.category}
                          </span>
                          <Button size="sm">View Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button variant="outline">View All Products</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}