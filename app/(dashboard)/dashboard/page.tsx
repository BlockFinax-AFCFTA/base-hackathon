'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeb3 } from "@/hooks/useWeb3"
import { useWallet } from "@/hooks/useWallet"
import { useContracts } from "@/hooks/useContracts"
import { useInvoice } from "@/hooks/useInvoice"
import { shortenAddress } from "@/lib/utils"
import { 
  BarChart, 
  CircleCheck, 
  Clock, 
  FileText, 
  RefreshCw,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  const { user, account } = useWeb3()
  const { wallets, transactions } = useWallet(user?.id)
  const { contracts } = useContracts()
  const { invoices } = useInvoice(user?.id)
  
  // Get the main wallet
  const mainWallet = wallets?.find(wallet => wallet.walletType === 'MAIN')
  
  // Get active contract count
  const activeContractCount = contracts?.filter(contract => 
    contract.status === 'ACTIVE' || contract.status === 'PENDING'
  ).length || 0
  
  // Get pending invoice count
  const pendingInvoiceCount = invoices?.filter(invoice => 
    invoice.status === 'PENDING' || invoice.status === 'PROCESSING'
  ).length || 0
  
  // Get recent transactions
  const recentTransactions = transactions?.slice(0, 5) || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button size="sm" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Balance
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(mainWallet?.balance || "0").toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              +2.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Contracts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeContractCount}</div>
            <Link href="/contracts" className="text-xs text-primary">
              Manage contracts
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invoices
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoiceCount}</div>
            <Link href="/invoices" className="text-xs text-primary">
              View invoices
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Account Overview */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
            <CardDescription>
              Your account and identity verification status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Username</span>
                <span className="font-medium">{user?.username || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Wallet Address</span>
                <span className="font-mono text-sm">
                  {shortenAddress(account, 6, 4)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">KYC Status</span>
                <div className="flex items-center">
                  {user?.kycStatus === 'VERIFIED' ? (
                    <CircleCheck className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  )}
                  <span className={user?.kycStatus === 'VERIFIED' ? 'text-green-700' : 'text-yellow-700'}>
                    {user?.kycStatus || 'PENDING'}
                  </span>
                </div>
              </div>
              {user?.kycStatus !== 'VERIFIED' && (
                <Button asChild size="sm" className="w-full mt-2">
                  <Link href="/kyc">Complete Verification</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>
              Recent transactions and actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map(tx => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        tx.txType === 'DEPOSIT' ? 'bg-green-100' : 
                        tx.txType === 'WITHDRAWAL' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className={`h-4 w-4 ${
                            tx.txType === 'DEPOSIT' ? 'text-green-500' : 
                            tx.txType === 'WITHDRAWAL' ? 'text-red-500' : 'text-blue-500'
                          }`}
                        >
                          {tx.txType === 'DEPOSIT' ? (
                            <path d="M12 5v14M19 12l-7 7-7-7" />
                          ) : tx.txType === 'WITHDRAWAL' ? (
                            <path d="M12 19V5M5 12l7-7 7 7" />
                          ) : (
                            <path d="M17 3v18M7 21V3M3 7h4M3 17h4M17 17h4M17 7h4" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.txType}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm font-medium ${
                      tx.txType === 'DEPOSIT' ? 'text-green-600' : 
                      tx.txType === 'WITHDRAWAL' ? 'text-red-600' : ''
                    }`}>
                      {tx.txType === 'DEPOSIT' ? '+' : 
                       tx.txType === 'WITHDRAWAL' ? '-' : ''}
                      ${parseFloat(tx.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent transactions</p>
              </div>
            )}
            <Button variant="outline" asChild size="sm" className="w-full mt-4">
              <Link href="/wallet">View All Transactions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Business Overview</CardTitle>
          <CardDescription>
            Your financial activity for the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <BarChart className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-muted-foreground">
                Complete your profile to unlock detailed analytics
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                <Link href="/kyc">Complete Setup</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}