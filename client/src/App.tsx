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

// Import stablecoin components
import StablecoinWallet from "../../components/wallet/StablecoinWallet";
import StablecoinInvoice from "../../components/invoice/StablecoinInvoice";
import StablecoinDemoPage from "../../pages/StablecoinDemoPage";
import InvoicePage from "@/components/invoice/InvoicePage";

// Auth-protected route component
const PrivateRoute = ({ component: Component, path, ...rest }: { component: React.ComponentType<any>, path: string }) => {
  const { isLoggedIn } = useWeb3();
  
  return (
    <Route
      path={path}
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
        
        {/* Stablecoin routes */}
        <Route path="/stablecoin" component={StablecoinDemoPage} />
        
        {/* Contract routes */}
        <PrivateRoute path="/contracts" component={ContractsPage} />
        <PrivateRoute path="/contracts/:id" component={ContractsPage} />
        <PrivateRoute path="/contracts/new" component={ContractsPage} />
        
        {/* Document routes */}
        <PrivateRoute path="/documents" component={DocumentsPage} />
        <PrivateRoute path="/documents/upload" component={DocumentsPage} />
        
        {/* Wallet routes */}
        <PrivateRoute path="/wallet" component={StablecoinWallet} />
        <PrivateRoute path="/wallet/legacy" component={WalletPage} />
        
        {/* Invoice routes */}
        <PrivateRoute path="/invoice" component={StablecoinInvoice} />
        <PrivateRoute path="/invoices" component={InvoicePage} />
        
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
