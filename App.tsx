import React from "react";
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/auth/AuthProvider";
import { AppProvider } from "./context/AppContext";
import { Web3Provider } from "./context/Web3Context";

// Pages
import HomePage from "./pages/HomePage";
import NotFound from "./pages/not-found";
import ContractsPage from "./pages/ContractsPage";
import DocumentsPage from "./pages/DocumentsPage";
import WalletPage from "./pages/wallet";
import StablecoinWallet from "./components/wallet/StablecoinWallet";
import BaseStablecoinsLogin from "./pages/base-stablecoins-login";
import DocumentTranslator from "./pages/document-translator";
import Layout from "./components/layout/Layout";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={BaseStablecoinsLogin} />
      <Route path="/login" component={BaseStablecoinsLogin} />
      
      {/* Protected routes - wrapped in Layout */}
      <Route path="/">
        {(params) => (
          <Layout>
            <Switch>
              <ProtectedRoute path="/" exact component={HomePage} />
              <ProtectedRoute path="/contracts" component={ContractsPage} />
              <ProtectedRoute path="/documents" component={DocumentsPage} />
              <ProtectedRoute path="/document-translator" component={DocumentTranslator} />
              <ProtectedRoute path="/wallet" component={StablecoinWallet} />
              <ProtectedRoute path="/wallet/legacy" component={WalletPage} />
              
              {/* 404 route */}
              <Route path="*">
                {() => <NotFound />}
              </Route>
            </Switch>
          </Layout>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <Web3Provider>
            <Router />
            <Toaster />
          </Web3Provider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;