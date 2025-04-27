import '../styles/globals.css'
import { Web3Provider } from '@/context/Web3Context'
import { AppProvider } from '@/context/AppContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'BlockFinaX - Blockchain Finance Platform',
  description: 'A blockchain-powered escrow platform that simplifies and secures international trade',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          <AppProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <Toaster />
            </QueryClientProvider>
          </AppProvider>
        </Web3Provider>
      </body>
    </html>
  )
}