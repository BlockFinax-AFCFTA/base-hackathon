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

function Router() {
  const { isConnected } = useWeb3();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/contracts" component={ContractsPage} />
        <Route path="/contracts/:id" component={ContractsPage} />
        <Route path="/contracts/new" component={ContractsPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/documents/upload" component={DocumentsPage} />
        <Route path="/wallet" component={WalletPage} />
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
