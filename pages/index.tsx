import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { RootLayout } from '../components/layout/RootLayout';

export default function Home() {
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    setLocation('/dashboard');
  }, [setLocation]);
  
  return (
    <RootLayout>
      <div className="flex h-screen flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-600 text-center">
          Redirecting to dashboard...
        </p>
      </div>
    </RootLayout>
  );
}