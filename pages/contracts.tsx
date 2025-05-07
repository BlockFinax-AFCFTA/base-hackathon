'use client'

import React, { useState } from 'react'
import Head from 'next/head'
import { BlockchainSidebar } from '../components/layout/BlockchainSidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { FileSpreadsheet, Plus, FileText, Users, Calendar, Clock, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useToast } from '../hooks/use-toast'

// Mock contract data
interface Contract {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  type: string;
  parties: {
    name: string;
    role: string;
    address: string;
  }[];
  createdDate: Date;
  expiryDate: Date | null;
  value: {
    amount: string;
    currency: string;
  };
  description: string;
}

const mockContracts: Contract[] = [
  {
    id: 'contract-001',
    name: 'Supply Chain Agreement',
    status: 'active',
    type: 'Service Contract',
    parties: [
      { name: 'Your Company', role: 'Provider', address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb' },
      { name: 'Global Logistics Inc.', role: 'Customer', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' }
    ],
    createdDate: new Date(2025, 3, 10),
    expiryDate: new Date(2026, 3, 10),
    value: {
      amount: '15000.00',
      currency: 'USDC'
    },
    description: 'International supply chain services agreement for logistics and warehousing.'
  },
  {
    id: 'contract-002',
    name: 'Cross-Border Payment Service',
    status: 'draft',
    type: 'Financial Agreement',
    parties: [
      { name: 'Your Company', role: 'Provider', address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb' },
      { name: 'International Payments Ltd.', role: 'Partner', address: '0x9e35b23dba3dfae7fbfc3b1f0dfde7b6ae619304' }
    ],
    createdDate: new Date(2025, 4, 5),
    expiryDate: null,
    value: {
      amount: '25000.00',
      currency: 'USDT'
    },
    description: 'Partnership agreement for cross-border payment services using stablecoins.'
  },
  {
    id: 'contract-003',
    name: 'Equipment Purchase',
    status: 'completed',
    type: 'Purchase Agreement',
    parties: [
      { name: 'Your Company', role: 'Buyer', address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb' },
      { name: 'Industrial Equipment Co.', role: 'Seller', address: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db' }
    ],
    createdDate: new Date(2025, 2, 20),
    expiryDate: new Date(2025, 3, 25),
    value: {
      amount: '12000.00',
      currency: 'USDC'
    },
    description: 'Purchase agreement for specialized manufacturing equipment with warranty terms.'
  }
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // New contract form state
  const [newContract, setNewContract] = useState({
    name: '',
    type: '',
    counterpartyName: '',
    counterpartyAddress: '',
    counterpartyRole: '',
    amount: '',
    currency: 'USDC',
    description: '',
  });
  
  // Handle creating new contract
  const handleCreateContract = async () => {
    // Validate form
    if (!newContract.name || !newContract.counterpartyAddress || !newContract.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new contract object
      const newContractObject: Contract = {
        id: `contract-${Date.now().toString(36)}`,
        name: newContract.name,
        status: 'draft',
        type: newContract.type,
        parties: [
          { 
            name: 'Your Company', 
            role: 'You', 
            address: '0x7C4E46d9D576B32598Bc4D77A91Ad4a00B188Deb'
          },
          { 
            name: newContract.counterpartyName, 
            role: newContract.counterpartyRole, 
            address: newContract.counterpartyAddress
          }
        ],
        createdDate: new Date(),
        expiryDate: null,
        value: {
          amount: newContract.amount,
          currency: newContract.currency
        },
        description: newContract.description
      };
      
      // Add to contracts list
      setContracts([newContractObject, ...contracts]);
      
      // Reset form and close dialog
      setNewContract({
        name: '',
        type: '',
        counterpartyName: '',
        counterpartyAddress: '',
        counterpartyRole: '',
        amount: '',
        currency: 'USDC',
        description: '',
      });
      
      setIsCreateOpen(false);
      
      toast({
        title: "Contract Created",
        description: "Your contract has been created as a draft."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContract({
      ...newContract,
      [name]: value
    });
  };
  
  // View contract details
  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsViewOpen(true);
  };
  
  // Format currency amount
  const formatCurrency = (amount: string) => {
    return parseFloat(amount).toFixed(2);
  };
  
  // Status badge color
  const getStatusBadgeVariant = (status: Contract['status']): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'draft': return 'outline';
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'terminated': return 'destructive';
      default: return 'outline';
    }
  };
  
  // Filter contracts based on active tab
  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'all') return true;
    return contract.status === activeTab;
  });
  
  return (
    <>
      <Head>
        <title>Contracts | Base Network Finance</title>
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
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Contract Management</h1>
                <p className="text-sm text-muted-foreground">
                  Manage and track your blockchain-based contracts
                </p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </Button>
            </div>
          </header>
          
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Contract Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.length > 0 ? (
                        filteredContracts.map((contract) => (
                          <TableRow key={contract.id}>
                            <TableCell className="font-medium">{contract.name}</TableCell>
                            <TableCell>{contract.type}</TableCell>
                            <TableCell>
                              {formatCurrency(contract.value.amount)} {contract.value.currency}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(contract.status)}>
                                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{format(contract.createdDate, 'PP')}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewContract(contract)}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                            No contracts found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
      
      {/* Create Contract Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Create New Contract
            </DialogTitle>
            <DialogDescription>
              Create a new blockchain-based contract with your counterparty
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Contract Name</Label>
              <Input
                id="name"
                name="name"
                value={newContract.name}
                onChange={handleInputChange}
                placeholder="Supply Agreement"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Contract Type</Label>
              <Input
                id="type"
                name="type"
                value={newContract.type}
                onChange={handleInputChange}
                placeholder="Service Contract"
              />
            </div>
            
            <Separator />
            
            <h3 className="text-md font-medium">Counterparty Information</h3>
            
            <div className="grid gap-2">
              <Label htmlFor="counterpartyName">Counterparty Name</Label>
              <Input
                id="counterpartyName"
                name="counterpartyName"
                value={newContract.counterpartyName}
                onChange={handleInputChange}
                placeholder="Company or individual name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="counterpartyRole">Counterparty Role</Label>
              <Input
                id="counterpartyRole"
                name="counterpartyRole"
                value={newContract.counterpartyRole}
                onChange={handleInputChange}
                placeholder="Customer, Supplier, Partner, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="counterpartyAddress">Counterparty Wallet Address</Label>
              <Input
                id="counterpartyAddress"
                name="counterpartyAddress"
                value={newContract.counterpartyAddress}
                onChange={handleInputChange}
                placeholder="0x..."
                required
              />
            </div>
            
            <Separator />
            
            <h3 className="text-md font-medium">Contract Value</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={newContract.amount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  name="currency"
                  value={newContract.currency}
                  onChange={handleInputChange}
                  placeholder="USDC"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Contract Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newContract.description}
                onChange={handleInputChange}
                placeholder="Describe the purpose and terms of this contract..."
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateContract} 
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Contract'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* View Contract Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center text-xl">
                  <FileSpreadsheet className="mr-2 h-5 w-5" />
                  {selectedContract.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedContract.type} • ID: {selectedContract.id}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4 space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contract Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Status</p>
                      <Badge variant={getStatusBadgeVariant(selectedContract.status)}>
                        {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Created Date</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        {format(selectedContract.createdDate, 'PP')}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground mb-1">Expiry Date</p>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        {selectedContract.expiryDate ? format(selectedContract.expiryDate, 'PP') : 'Not set'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Contract Parties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedContract.parties.map((party, index) => (
                        <div key={index} className="border rounded-md p-3">
                          <p className="font-medium">{party.name}</p>
                          <p className="text-sm text-muted-foreground">Role: {party.role}</p>
                          <p className="text-xs font-mono mt-1">{party.address}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Contract Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {formatCurrency(selectedContract.value.amount)} {selectedContract.value.currency}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedContract.description}</p>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between items-center mt-6">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Attached Documents
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {selectedContract.status === 'draft' && (
                      <Button size="sm">
                        Activate Contract
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}