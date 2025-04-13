import { Switch, Route, Redirect } from "wouter";
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

// Auth-protected route component
const PrivateRoute = ({ component: Component, ...rest }: { component: React.ComponentType<any>, path: string }) => {
  const { isLoggedIn } = useWeb3();
  
  return (
    <Route
      path={rest.path}
      {...rest}
      component={(params: any) => 
        isLoggedIn ? (
          <Component {...params} />
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        
        {/* Contract routes */}
        <PrivateRoute path="/contracts" component={ContractsPage} />
        <PrivateRoute path="/contracts/:id" component={ContractsPage} />
        <PrivateRoute path="/contracts/new" component={ContractsPage} />
        
        {/* Document routes */}
        <PrivateRoute path="/documents" component={DocumentsPage} />
        <PrivateRoute path="/documents/upload" component={DocumentsPage} />
        
        {/* Wallet routes */}
        <PrivateRoute path="/wallet" component={EnhancedWalletPage} />
        <PrivateRoute path="/wallet/legacy" component={WalletPage} />
        
        {/* Invoice routes */}
        <PrivateRoute path="/invoices" component={InvoicePage} />
        
        {/* Trade Finance routes */}
        <PrivateRoute path="/trade-finance" component={TradeFinancePage} />
        
        {/* KYC & Passport routes */}
        <PrivateRoute path="/kyc" component={KYCPage} />
        <PrivateRoute path="/passport" component={KYCPage} />
        
        {/* Other routes */}
        <Route path="/api">
          {() => <NotFound customMessage="API documentation coming soon" />}
        </Route>
        <Route path="/docs">
          {() => <NotFound customMessage="Documentation coming soon" />}
        </Route>
        <Route>
          {() => <NotFound customMessage="Page not found" />}
        </Route>
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <Web3Provider>
        <QueryClientProvider client={queryClient}>
          <Router />
          <Toaster />
        </QueryClientProvider>
      </Web3Provider>
    </AppProvider>
  );
}

export default App;
