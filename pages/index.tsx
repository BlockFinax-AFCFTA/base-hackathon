import React from 'react'
import TestComponent from '../components/TestComponent'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-6">Blockchain-Powered Escrow Platform</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Streamline international trade through secure, transparent, and intelligent contract management
      </p>
      <div className="mt-6">
        <TestComponent />
      </div>
    </div>
  )
}