import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

// ERC20 ABI for stablecoin interactions
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 amount)"
];

// Payment processor contract ABI
const PAYMENT_PROCESSOR_ABI = [
  "function processPayment(address token, address recipient, uint256 amount) returns (bool)",
  "function processPaymentWithInvoice(address token, address recipient, uint256 amount, string invoiceId) returns (bool)",
  "function getPaymentHistory(address user) view returns (address[] recipients, uint256[] amounts, uint256[] timestamps)",
  "event PaymentProcessed(address indexed from, address indexed to, address indexed token, uint256 amount, string invoiceId)"
];

// Common stablecoin addresses on Base network
export const STABLECOIN_ADDRESSES = {
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // Base Mainnet USDC
  USDT: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // Base Mainnet USDT
  DAI: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb",  // Base Mainnet DAI
};

// BlockFinaX network configuration
export const BASE_NETWORK = {
  name: "BlockFinaX Network",
  chainId: 8453,
  rpcUrl: "https://mainnet.base.org",
  blockExplorer: "https://basescan.org",
  testnet: false
};

export const BASE_TESTNET = {
  name: "BlockFinaX Testnet",
  chainId: 84531,
  rpcUrl: "https://goerli.base.org",
  blockExplorer: "https://goerli.basescan.org",
  testnet: true
};

export class Web3Service {
  private provider: ethers.JsonRpcProvider | ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  
  constructor(provider?: ethers.BrowserProvider, signer?: ethers.Signer) {
    this.provider = provider || null;
    this.signer = signer || null;
  }
  
  setProvider(provider: ethers.JsonRpcProvider | ethers.BrowserProvider) {
    this.provider = provider;
  }
  
  setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }

  async connectToBaseNetwork(useTestnet = false) {
    try {
      let provider;
      let signer;
      
      if (window.ethereum) {
        // External wallet is available, try to connect to it
        try {
          // Request wallet connection
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Create provider using external wallet
          provider = new ethers.BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
        } catch (externalWalletError) {
          console.log('External wallet connection failed, using integrated wallet');
          // Fall back to integrated wallet
          provider = new ethers.JsonRpcProvider(useTestnet ? BASE_TESTNET.rpcUrl : BASE_NETWORK.rpcUrl);
          
          // Create a random wallet for the integrated solution
          // In a production app, this would be securely managed and persistent
          const privateKey = ethers.Wallet.createRandom().privateKey;
          signer = new ethers.Wallet(privateKey, provider);
        }
      } else {
        // No external wallet available, use integrated wallet
        console.log('No external wallet found, using integrated wallet');
        provider = new ethers.JsonRpcProvider(useTestnet ? BASE_TESTNET.rpcUrl : BASE_NETWORK.rpcUrl);
        
        // Create a random wallet for integrated mode
        // In a production app, this would be securely managed and persistent
        const privateKey = ethers.Wallet.createRandom().privateKey;
        signer = new ethers.Wallet(privateKey, provider);
      }
      
      // Set the provider and signer
      this.provider = provider;
      this.signer = signer;
      
      // Check if user is on the correct network
      const targetNetwork = useTestnet ? BASE_TESTNET : BASE_NETWORK;
      
      // For external wallets, we may need to switch networks
      if (window.ethereum) {
        try {
          const network = await this.provider.getNetwork();
          
          if (Number(network.chainId) !== targetNetwork.chainId) {
            try {
              // Try to switch to Base network
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.toBeHex(targetNetwork.chainId) }]
              });
              
              // Get updated provider and signer after network switch
              this.provider = new ethers.BrowserProvider(window.ethereum);
              this.signer = await this.provider.getSigner();
            } catch (switchError: any) {
              // If network is not added, add it
              if (switchError.code === 4902) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: ethers.toBeHex(targetNetwork.chainId),
                    chainName: targetNetwork.name,
                    rpcUrls: [targetNetwork.rpcUrl],
                    blockExplorerUrls: [targetNetwork.blockExplorer],
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    }
                  }]
                });
                
                // Get updated provider and signer after network add
                this.provider = new ethers.BrowserProvider(window.ethereum);
                this.signer = await this.provider.getSigner();
              } else {
                // If there's an error switching networks with external wallet,
                // fall back to integrated wallet on the correct network
                console.log('Error switching networks, using integrated wallet');
                this.provider = new ethers.JsonRpcProvider(targetNetwork.rpcUrl);
                const privateKey = ethers.Wallet.createRandom().privateKey;
                this.signer = new ethers.Wallet(privateKey, this.provider);
              }
            }
          }
        } catch (networkCheckError) {
          console.error('Network check error:', networkCheckError);
          // If there's an error checking the network, ensure we're on the target network
          // by using the integrated wallet with the correct network
          this.provider = new ethers.JsonRpcProvider(targetNetwork.rpcUrl);
          const privateKey = ethers.Wallet.createRandom().privateKey;
          this.signer = new ethers.Wallet(privateKey, this.provider);
        }
      }
      // For integrated wallet, we're already on the correct network
      
      return {
        address: await this.signer.getAddress(),
        chainId: targetNetwork.chainId,
        networkName: targetNetwork.name
      };
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }
  
  async getStablecoinContract(tokenAddress: string) {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not set. Connect to wallet first.');
    }
    
    return new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
  }
  
  async getTokenDetails(tokenAddress: string) {
    const contract = await this.getStablecoinContract(tokenAddress);
    
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals()
    ]);
    
    return { name, symbol, decimals };
  }
  
  async getTokenBalance(tokenAddress: string, walletAddress?: string) {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not set');
    }
    
    const contract = await this.getStablecoinContract(tokenAddress);
    const address = walletAddress || await this.signer.getAddress();
    
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    
    return {
      raw: balance,
      formatted: ethers.formatUnits(balance, decimals)
    };
  }
  
  async transferTokens(tokenAddress: string, recipientAddress: string, amount: string) {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not set');
    }
    
    const contract = await this.getStablecoinContract(tokenAddress);
    const decimals = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);
    
    const tx = await contract.transfer(recipientAddress, parsedAmount);
    return await tx.wait();
  }
  
  async approveTokens(tokenAddress: string, spenderAddress: string, amount: string) {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not set');
    }
    
    const contract = await this.getStablecoinContract(tokenAddress);
    const decimals = await contract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);
    
    const tx = await contract.approve(spenderAddress, parsedAmount);
    return await tx.wait();
  }
  
  async processPayment(
    paymentProcessorAddress: string,
    tokenAddress: string, 
    recipientAddress: string, 
    amount: string,
    invoiceId?: string
  ) {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not set');
    }
    
    const tokenContract = await this.getStablecoinContract(tokenAddress);
    const decimals = await tokenContract.decimals();
    const parsedAmount = ethers.parseUnits(amount, decimals);
    
    // First approve the payment processor to spend tokens
    const approveTx = await tokenContract.approve(paymentProcessorAddress, parsedAmount);
    await approveTx.wait();
    
    // Then process the payment
    const paymentProcessor = new ethers.Contract(
      paymentProcessorAddress,
      PAYMENT_PROCESSOR_ABI,
      this.signer
    );
    
    let tx;
    if (invoiceId) {
      tx = await paymentProcessor.processPaymentWithInvoice(
        tokenAddress,
        recipientAddress,
        parsedAmount,
        invoiceId
      );
    } else {
      tx = await paymentProcessor.processPayment(
        tokenAddress,
        recipientAddress,
        parsedAmount
      );
    }
    
    return await tx.wait();
  }
  
  async getEthBalance(address?: string) {
    if (!this.provider) {
      throw new Error('Provider not set');
    }
    
    let targetAddress: string;
    if (address) {
      targetAddress = address;
    } else if (this.signer) {
      targetAddress = await this.signer.getAddress();
    } else {
      throw new Error('No address specified');
    }
    
    const balance = await this.provider.getBalance(targetAddress);
    return {
      raw: balance,
      formatted: ethers.formatEther(balance)
    };
  }
}

export default Web3Service;
