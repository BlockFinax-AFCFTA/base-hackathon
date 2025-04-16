import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWeb3 } from '../hooks/useWeb3';

const HomePage: NextPage = () => {
  const router = useRouter();
  const { isLoggedIn, isInitializing } = useWeb3();
  
  // Redirect to dashboard if logged in
  React.useEffect(() => {
    if (isLoggedIn && !isInitializing) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, isInitializing, router]);
  
  return (
    <>
      <Head>
        <title>BlockFinaX | Secure Trade Platform</title>
      </Head>
      
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="container max-w-6xl px-4 py-10 md:py-20">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Blockchain-Powered Escrow for International Trade
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                Simplify and secure international trade through intelligent, transparent contract management and user-friendly KYC processes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button 
                  onClick={() => router.push('/register')}
                  className="px-6 py-3 text-md font-medium text-white bg-primary rounded-md shadow-md hover:bg-primary/90 transition-colors"
                >
                  Get Started
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="px-6 py-3 text-md font-medium text-primary bg-transparent border border-primary rounded-md hover:bg-primary/10 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center p-4">
              <div className="w-full h-80 bg-gray-100 rounded-lg flex items-center justify-center border">
                <span className="text-2xl font-bold text-primary">BlockFinaX</span>
              </div>
            </div>
          </div>
          
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center mb-10">Our Key Features</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-muted-foreground">Blockchain-backed escrow system ensures all parties fulfill their obligations before funds are released.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Smart Contracts</h3>
                <p className="text-muted-foreground">Automate trade agreement execution with programmable terms that provide transparency and reliability.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Risk Intelligence</h3>
                <p className="text-muted-foreground">Advanced analytics help identify potential trade risks before they affect your business.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;