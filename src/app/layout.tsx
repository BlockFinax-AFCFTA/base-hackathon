import { AppProvider } from '@/context/AppContext';
import { Web3Provider } from '@/context/Web3Context';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Trade Escrow Platform',
  description: 'A blockchain-powered escrow platform for international trade',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </Web3Provider>
      </body>
    </html>
  );
}