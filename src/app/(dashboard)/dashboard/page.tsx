'use client'

import { useWeb3 } from '@/hooks/useWeb3'

export default function DashboardPage() {
  const { user } = useWeb3()
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.username || 'User'}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View your account overview and manage your transactions.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Your recent transaction activity will appear here.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">KYC Status</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Complete your KYC verification to unlock all platform features.
          </p>
        </div>
      </div>
    </div>
  )
}