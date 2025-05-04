import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { queryClient } from '../lib/queryClient';
import { useWeb3 } from '../hooks/useWeb3';
import { useToast } from '../hooks/use-toast';

interface Balance {
  amount: string;
  currency: string;
  currencyType: 'fiat' | 'crypto';
}

interface Wallet {
  id: number;
  userId: number;
  walletType: 'main' | 'escrow' | 'crypto';
  walletProvider: 'internal' | 'papss' | 'self_custody';
  contractId: number | null;
  balances: Balance[];
  primaryCurrency: string;
  walletAddress?: string;
  privateKey?: string; // This should be securely managed and encrypted
  publicKey?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Document {
  id: number;
  name: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: number;
  isVerified: boolean | null;
  createdAt: Date;
  contractId: number | null;
  invoiceId: number | null;
}

interface Transaction {
  id: number;
  fromWalletId: number | null;
  toWalletId: number | null;
  amount: string;
  currency: string;
  currencyType: 'fiat' | 'crypto';
  txType: string;
  status: string;
  contractId: number | null;
  description: string | null;
  createdAt: Date;
  completedAt?: Date;
  // Transaction provider
  provider: 'internal' | 'papss' | 'blockchain';
  // For crypto transactions
  transactionHash?: string;
  blockNumber?: number;
  blockConfirmations?: number;
  gasUsed?: string;
  gasFee?: string;
  network?: string;
  fromAddress?: string;
  toAddress?: string;
  // For PAPSS transactions
  papssReference?: string;
  papssStatus?: string;
  sourceBank?: string;
  destinationBank?: string;
  exchangeRate?: string;
  // General metadata
  metadata: Record<string, any> | null;
  // Related documents
  documents?: Document[];
}

export const useWallet = (userId?: number, walletId?: number) => {
  const { toast } = useToast();
  const { user } = useWeb3();

  // If userId not provided, use the current user's ID
  const currentUserId = userId || (user?.id as number);

  // Get user's wallets
  const {
    data: wallets = [],
    isLoading: isLoadingWallets,
    error: walletsError,
    refetch: refetchWallets,
  } = useQuery({
    queryKey: ['/api/users', currentUserId, 'wallets'],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/users/${currentUserId}/wallets`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Get single wallet
  const {
    data: wallet,
    isLoading: isLoadingWallet,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['/api/wallets', walletId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/wallets/${walletId}`);
      return res.json();
    },
    enabled: !!walletId,
  });

  // Get transactions for a wallet
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ['/api/wallets', walletId, 'transactions'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/wallets/${walletId}/transactions`);
      return res.json();
    },
    enabled: !!walletId,
  });

  // Get all user transactions
  const {
    data: userTransactions = [],
    isLoading: isLoadingUserTransactions,
    error: userTransactionsError,
    refetch: refetchUserTransactions,
  } = useQuery({
    queryKey: ['/api/users', currentUserId, 'transactions'],
    queryFn: async () => {
      if (!currentUserId) return [];
      const res = await apiRequest('GET', `/api/users/${currentUserId}/transactions`);
      return res.json();
    },
    enabled: !!currentUserId,
  });

  // Deposit to wallet
  const depositMutation = useMutation({
    mutationFn: async ({ walletId, amount, currency }: { walletId: number, amount: string, currency?: string }) => {
      const res = await apiRequest('POST', `/api/wallets/${walletId}/deposit`, { amount, currency });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Deposit Successful",
        description: "Funds have been added to your wallet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Deposit Failed",
        description: error.message || "There was an error processing your deposit.",
        variant: "destructive",
      });
    },
  });

  // Withdraw from wallet
  const withdrawMutation = useMutation({
    mutationFn: async ({ walletId, amount, currency }: { walletId: number, amount: string, currency?: string }) => {
      const res = await apiRequest('POST', `/api/wallets/${walletId}/withdraw`, { amount, currency });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId, 'transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Withdrawal Successful",
        description: "Funds have been withdrawn from your wallet.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Withdrawal Failed",
        description: error.message || "There was an error processing your withdrawal.",
        variant: "destructive",
      });
    },
  });

  // Transfer between wallets
  const transferMutation = useMutation({
    mutationFn: async ({ fromWalletId, toWalletId, amount, currency, description }: { fromWalletId: number, toWalletId: number, amount: string, currency?: string, description?: string }) => {
      const res = await apiRequest('POST', `/api/wallets/${fromWalletId}/transfer/${toWalletId}`, { amount, currency, description });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Transfer Successful",
        description: "Funds have been transferred successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "There was an error processing your transfer.",
        variant: "destructive",
      });
    },
  });

  // Fund escrow for a contract
  const fundEscrowMutation = useMutation({
    mutationFn: async ({ contractId, fromWalletId }: { contractId: number, fromWalletId: number }) => {
      const res = await apiRequest('POST', `/api/contracts/${contractId}/fund`, { fromWalletId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Escrow Funded",
        description: "Contract escrow has been funded successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Escrow Funding Failed",
        description: error.message || "There was an error funding the escrow.",
        variant: "destructive",
      });
    },
  });

  // Release escrow funds
  const releaseEscrowMutation = useMutation({
    mutationFn: async ({ contractId, toWalletId, type }: { contractId: number, toWalletId: number, type: 'seller' | 'buyer' }) => {
      const res = await apiRequest('POST', `/api/contracts/${contractId}/release`, { toWalletId, type });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contracts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Escrow Released",
        description: "Funds have been released from escrow.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Escrow Release Failed",
        description: error.message || "There was an error releasing the escrow funds.",
        variant: "destructive",
      });
    },
  });

  // Create a crypto wallet
  const createCryptoWalletMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/wallets/crypto/create`, {
        userId: currentUserId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      toast({
        title: "Crypto Wallet Created",
        description: "Your self-custody crypto wallet has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Crypto Wallet Creation Failed",
        description: error.message || "There was an error creating your crypto wallet.",
        variant: "destructive",
      });
    },
  });

  // Import existing crypto wallet
  const importCryptoWalletMutation = useMutation({
    mutationFn: async ({ privateKey, walletAddress }: { privateKey: string, walletAddress?: string }) => {
      const res = await apiRequest('POST', `/api/wallets/crypto/import`, {
        userId: currentUserId,
        privateKey,
        walletAddress
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      toast({
        title: "Crypto Wallet Imported",
        description: "Your crypto wallet has been imported successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Crypto Wallet Import Failed",
        description: error.message || "There was an error importing your crypto wallet.",
        variant: "destructive",
      });
    },
  });

  // Connect to PAPSS for fiat wallet
  const connectPAPSSWalletMutation = useMutation({
    mutationFn: async ({ 
      accountNumber, 
      bankCode, 
      bankName, 
      accountName 
    }: { 
      accountNumber: string, 
      bankCode: string, 
      bankName: string, 
      accountName: string 
    }) => {
      const res = await apiRequest('POST', `/api/wallets/papss/connect`, {
        userId: currentUserId,
        accountNumber,
        bankCode,
        bankName,
        accountName
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      toast({
        title: "PAPSS Account Connected",
        description: "Your bank account has been connected to PAPSS for fiat transactions.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "PAPSS Connection Failed",
        description: error.message || "There was an error connecting your bank account to PAPSS.",
        variant: "destructive",
      });
    },
  });

  // Send crypto to external wallet
  const sendCryptoMutation = useMutation({
    mutationFn: async ({ 
      fromWalletId, 
      toAddress, 
      amount, 
      currency,
      gasPrice
    }: { 
      fromWalletId: number, 
      toAddress: string, 
      amount: string, 
      currency: string,
      gasPrice?: string
    }) => {
      const res = await apiRequest('POST', `/api/wallets/${fromWalletId}/crypto/send`, { 
        toAddress, 
        amount, 
        currency,
        gasPrice
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "Crypto Sent",
        description: "Your crypto transaction has been submitted to the blockchain.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Crypto Send Failed",
        description: error.message || "There was an error sending your crypto.",
        variant: "destructive",
      });
    },
  });

  // PAPSS-specific fiat deposit
  const papssDepositMutation = useMutation({
    mutationFn: async ({ 
      walletId, 
      amount, 
      currency, 
      sourceAccount 
    }: { 
      walletId: number, 
      amount: string, 
      currency: string, 
      sourceAccount: string 
    }) => {
      const res = await apiRequest('POST', `/api/wallets/${walletId}/papss/deposit`, { 
        amount, 
        currency, 
        sourceAccount 
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "PAPSS Deposit Initiated",
        description: "Your funds transfer has been initiated via PAPSS.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "PAPSS Deposit Failed",
        description: error.message || "There was an error with your PAPSS deposit.",
        variant: "destructive",
      });
    },
  });

  // PAPSS-specific fiat withdrawal
  const papssWithdrawMutation = useMutation({
    mutationFn: async ({ 
      walletId, 
      amount, 
      currency, 
      destinationAccount,
      bankCode,
      accountName
    }: { 
      walletId: number, 
      amount: string, 
      currency: string, 
      destinationAccount: string,
      bankCode: string,
      accountName: string
    }) => {
      const res = await apiRequest('POST', `/api/wallets/${walletId}/papss/withdraw`, { 
        amount, 
        currency, 
        destinationAccount,
        bankCode,
        accountName
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'wallets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallets', walletId] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUserId, 'transactions'] });
      toast({
        title: "PAPSS Withdrawal Initiated",
        description: "Your funds withdrawal has been initiated via PAPSS.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "PAPSS Withdrawal Failed",
        description: error.message || "There was an error with your PAPSS withdrawal.",
        variant: "destructive",
      });
    },
  });

  // Get supported currencies
  const { 
    data: supportedCurrencies = {
      fiat: [
        { code: 'XOF', name: 'West African CFA Franc', countries: ['Benin', 'Burkina Faso', 'Côte d\'Ivoire', 'Guinea-Bissau', 'Mali', 'Niger', 'Senegal', 'Togo'] },
        { code: 'XAF', name: 'Central African CFA Franc', countries: ['Cameroon', 'Central African Republic', 'Chad', 'Republic of the Congo', 'Equatorial Guinea', 'Gabon'] },
        { code: 'NGN', name: 'Nigerian Naira', countries: ['Nigeria'] },
        { code: 'ZAR', name: 'South African Rand', countries: ['South Africa', 'Lesotho', 'Namibia'] },
        { code: 'EGP', name: 'Egyptian Pound', countries: ['Egypt'] },
        { code: 'KES', name: 'Kenyan Shilling', countries: ['Kenya'] },
        { code: 'USD', name: 'US Dollar', countries: ['International'] }
      ],
      crypto: [
        { code: 'ETH', name: 'Ethereum', network: 'Ethereum Mainnet' },
        { code: 'USDT', name: 'Tether USD', network: 'Ethereum ERC-20' },
        { code: 'USDC', name: 'USD Coin', network: 'Ethereum ERC-20' }
      ]
    },
    isLoading: isLoadingSupportedCurrencies
  } = useQuery({
    queryKey: ['/api/currencies/supported'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/currencies/supported');
      return res.json();
    }
  });

  return {
    // Wallet data
    wallets,
    wallet,
    transactions,
    userTransactions,
    supportedCurrencies,
    // Loading states
    isLoadingWallets,
    isLoadingWallet,
    isLoadingTransactions,
    isLoadingUserTransactions,
    isLoadingSupportedCurrencies,
    // Errors
    walletsError,
    walletError,
    transactionsError,
    userTransactionsError,
    // Refetch functions
    refetchWallets,
    refetchWallet,
    refetchTransactions,
    refetchUserTransactions,
    // Basic wallet mutations
    depositMutation,
    withdrawMutation,
    transferMutation,
    fundEscrowMutation,
    releaseEscrowMutation,
    // Crypto wallet mutations
    createCryptoWalletMutation,
    importCryptoWalletMutation,
    sendCryptoMutation,
    // PAPSS wallet mutations
    connectPAPSSWalletMutation,
    papssDepositMutation,
    papssWithdrawMutation,
  };
};