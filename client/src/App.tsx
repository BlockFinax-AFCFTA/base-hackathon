import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import ContractsPage from "@/pages/ContractsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import WalletPage from "@/pages/WalletPage";
import Layout from "@/components/layout/Layout";
import { useWeb3 } from "./hooks/useWeb3";
import { AppProvider } from "./context/AppContext";
import { Web3Provider } from "./context/Web3Context";

// Import new components
import EnhancedWalletPage from "@/components/wallet/WalletPage";
import InvoicePage from "@/components/invoice/InvoicePage";
import TradeFinancePage from "@/components/tradeFinance/TradeFinancePage";
import KYCPage from "@/components/kyc/KYCPage";

function Router() {
  const { isConnected } = useWeb3();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        
        {/* Contract routes */}
        <Route path="/contracts" component={ContractsPage} />
        <Route path="/contracts/:id" component={ContractsPage} />
        <Route path="/contracts/new" component={ContractsPage} />
        
        {/* Document routes */}
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/documents/upload" component={DocumentsPage} />
        
        {/* Wallet routes */}
        <Route path="/wallet" component={EnhancedWalletPage} />
        <Route path="/wallet/legacy" component={WalletPage} />
        
        {/* Invoice routes */}
        <Route path="/invoices" component={InvoicePage} />
        
        {/* Trade Finance routes */}
        <Route path="/trade-finance" component={TradeFinancePage} />
        
        {/* KYC & Passport routes */}
        <Route path="/kyc" component={KYCPage} />
        <Route path="/passport" component={KYCPage} />
        
        {/* Other routes */}
        <Route path="/api">
          {() => <NotFound customMessage="API documentation coming soon" />}
        </Route>
        <Route path="/docs">
          {() => <NotFound customMessage="Documentation coming soon" />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
