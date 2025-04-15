import Layout from '../components/layout/Layout'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  
  // We'll implement a simple page that displays content or redirects to login
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-4xl font-bold mb-6">Blockchain-Powered Escrow Platform</h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          Streamline international trade through secure, transparent, and intelligent contract management
        </p>
        <div className="flex gap-4">
          <button 
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            onClick={() => router.push('/login')}
          >
            Get Started
          </button>
        </div>
      </div>
    </Layout>
  )
}