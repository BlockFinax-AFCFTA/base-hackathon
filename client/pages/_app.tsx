
import type { AppProps } from 'next/app'
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/queryClient"
import { Web3Provider } from "@/context/Web3Context"
import { AppProvider } from "@/context/AppContext"
import { Toaster } from "@/components/ui/toaster"
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <AppProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Toaster />
        </QueryClientProvider>
      </AppProvider>
    </Web3Provider>
  )
}
