import React from 'react';
import { Switch, Route } from 'wouter';
import { AppProvider } from './context/AppContext';
import { Web3Provider } from './context/Web3Context';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ContractsPage from './pages/ContractsPage';
import ContractDetailsPage from './pages/ContractDetailsPage';
import DocumentsPage from './pages/DocumentsPage';
import WalletPage from './pages/WalletPage';
import InvoicesPage from './pages/InvoicesPage';
import LogisticsPage from './pages/LogisticsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AppProvider>
      <Web3Provider>
        <Layout>
          <Switch>
            <Route path="/" component={HomePage} />
            
            {/* Contract routes */}
            <Route path="/contracts" component={ContractsPage} />
            <Route path="/contracts/:id">
              {(params) => <ContractDetailsPage contractId={params.id} />}
            </Route>
            
            {/* Document routes */}
            <Route path="/documents" component={DocumentsPage} />
            
            {/* Wallet routes */}
            <Route path="/wallet" component={WalletPage} />
            
            {/* Invoice routes */}
            <Route path="/invoices" component={InvoicesPage} />
            
            {/* Logistics routes */}
            <Route path="/logistics" component={LogisticsPage} />
            
            {/* 404 route */}
            <Route component={NotFoundPage} />
          </Switch>
        </Layout>
      </Web3Provider>
    </AppProvider>
  );
}

export default App;