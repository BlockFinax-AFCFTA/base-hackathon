'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { redirect } from 'next/navigation'
import NextHeader from '@/components/layout/NextHeader'
import NextSidebar from '@/components/layout/NextSidebar'
import { useAppContext } from '@/hooks/useAppContext'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn } = useWeb3()
  const { isKYCCompleted, sidebarOpen } = useAppContext()

  if (!isLoggedIn) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <NextHeader />
      <div className="flex">
        {sidebarOpen && <NextSidebar />}
        <main className={`flex-1 p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {!isKYCCompleted && (
            <div className="bg-yellow-50 p-4 mb-6 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Please complete identity verification to access all features.
                    <Link href="/kyc" className="font-medium underline ml-2">Complete KYC</Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}