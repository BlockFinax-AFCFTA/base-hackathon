import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/contracts/:id" element={<ContractDetailsPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/logistics" element={<LogisticsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Web3Provider>
    </AppProvider>
  );
}

export default App;