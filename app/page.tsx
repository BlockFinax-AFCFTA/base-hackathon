'use client'

import { useWeb3 } from "@/hooks/useWeb3"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Shield, 
  FileText, 
  Wallet
} from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { isLoggedIn } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/dashboard')
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Secure international trade on blockchain.{' '}
              <a href="#features" className="font-semibold text-primary">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Trade finance powered by blockchain
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              BlockFinaX simplifies and secures international trade through intelligent, transparent contract management and user-friendly KYC processes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg">
                <Link href="/register">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Trade Faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need for global trade</p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our blockchain-powered platform streamlines international trade with secure contracts, efficient document management, and transparent risk assessment.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Enhanced Security
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Blockchain-backed contracts and documents with advanced verification to prevent fraud and ensure secure transactions across borders.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <FileText className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Intelligent Contracts
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Create and manage smart contracts that automatically execute based on predefined conditions, reducing friction in international trade.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <Wallet className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Integrated Payments
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Seamless payment processing with escrow protection and multi-currency support for international transactions.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}