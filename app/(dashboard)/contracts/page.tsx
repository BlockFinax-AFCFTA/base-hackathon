'use client'

import { useEffect, useState } from 'react'
import { useWeb3 } from '@/hooks/useWeb3'
import { useContracts } from '@/hooks/useContracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  Filter, 
  ArrowUpDown, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search
} from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function ContractsPage() {
  const { user } = useWeb3()
  const { contracts, isLoading } = useContracts(user?.id)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'COMPLETED':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }
  
  const filteredContracts = contracts?.filter(contract => {
    // Search filter
    const searchMatch = 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contract.description && contract.description.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Status filter
    const statusMatch = statusFilter === 'all' || contract.status === statusFilter
    
    return searchMatch && statusMatch
  }) || []
  
  const myContracts = filteredContracts.filter(c => c.buyerId === user?.id || c.sellerId === user?.id)
  const sharedContracts = filteredContracts.filter(c => c.buyerId !== user?.id && c.sellerId !== user?.id)
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Contracts</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> 
          New Contract
        </Button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search contracts..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Tabs for My Contracts vs Shared Contracts */}
      <Tabs defaultValue="my-contracts" className="mb-6">
        <TabsList>
          <TabsTrigger value="my-contracts">My Contracts</TabsTrigger>
          <TabsTrigger value="shared-contracts">Shared With Me</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-contracts">
          {isLoading ? (
            <div className="text-center py-8">Loading contracts...</div>
          ) : myContracts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myContracts.map(contract => (
                <Link href={`/contracts/${contract.id}`} key={contract.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contract.title}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(contract.status)}>
                          {getStatusIcon(contract.status)}
                          <span className="ml-1">{contract.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Contract #{contract.contractNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">Value:</span>
                          <span className="font-medium">
                            ${parseFloat(contract.value).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">Created:</span>
                          <span>
                            {new Date(contract.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Role:</span>
                          <span>
                            {contract.sellerId === user?.id ? 'Seller' : 'Buyer'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium mb-1">No contracts found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get started by creating your first contract
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> 
                Create Contract
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="shared-contracts">
          {isLoading ? (
            <div className="text-center py-8">Loading contracts...</div>
          ) : sharedContracts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sharedContracts.map(contract => (
                <Link href={`/contracts/${contract.id}`} key={contract.id}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{contract.title}</CardTitle>
                        <Badge variant="outline" className={getStatusColor(contract.status)}>
                          {getStatusIcon(contract.status)}
                          <span className="ml-1">{contract.status}</span>
                        </Badge>
                      </div>
                      <CardDescription>
                        Contract #{contract.contractNumber}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">Value:</span>
                          <span className="font-medium">
                            ${parseFloat(contract.value).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">Created:</span>
                          <span>
                            {new Date(contract.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Access:</span>
                          <span>Shared</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button variant="outline" className="w-full">View Details</Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No shared contracts</h3>
              <p className="text-sm text-gray-500">
                Contracts shared with you will appear here
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}