'use client'

import { useWeb3 } from '@/hooks/useWeb3'
import { redirect } from 'next/navigation'
import Layout from '@/components/layout/Layout'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn } = useWeb3()

  if (!isLoggedIn) {
    redirect('/')
  }

  return <Layout>{children}</Layout>
}