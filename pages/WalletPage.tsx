import React from 'react';
import MockEscrowWalletPage from '../components/wallet/MockEscrowWalletPage';

const WalletPage: React.FC = () => {
  // Using the standalone mock implementation that will always show escrow wallets
  // and transactions with documents
  return <MockEscrowWalletPage />;
};

export default WalletPage;
