import { ethers } from 'ethers';

const ESCROW_CONTRACT_ABI = [
  // This is a simplified ABI for an escrow contract
  "function createEscrow(address _seller, address _mediator, uint256 _value, uint256 _releaseTime) payable returns (uint256)",
  "function getEscrowDetails(uint256 _escrowId) view returns (address buyer, address seller, address mediator, uint256 amount, uint256 releaseTime, uint8 status)",
  "function confirmDelivery(uint256 _escrowId)",
  "function refundBuyer(uint256 _escrowId)",
  "function resolveDispute(uint256 _escrowId, bool _releaseToSeller)",
  "function raiseDispute(uint256 _escrowId)"
];

export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  
  constructor(provider?: ethers.providers.Web3Provider, signer?: ethers.Signer) {
    this.provider = provider || null;
    this.signer = signer || null;
  }
  
  setProvider(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
  }
  
  setSigner(signer: ethers.Signer) {
    this.signer = signer;
  }
  
  async getEscrowContract(contractAddress: string) {
    if (!this.provider || !this.signer) {
      throw new Error('Provider or signer not set');
    }
    
    return new ethers.Contract(contractAddress, ESCROW_CONTRACT_ABI, this.signer);
  }
  
  async createEscrow(
    contractAddress: string,
    seller: string,
    mediator: string,
    valueInEther: string,
    releaseTimeInSeconds: number
  ) {
    const contract = await this.getEscrowContract(contractAddress);
    const valueInWei = ethers.utils.parseEther(valueInEther);
    
    const tx = await contract.createEscrow(
      seller,
      mediator,
      valueInWei,
      releaseTimeInSeconds,
      { value: valueInWei }
    );
    
    return tx.wait();
  }
  
  async getEscrowDetails(contractAddress: string, escrowId: number) {
    const contract = await this.getEscrowContract(contractAddress);
    const details = await contract.getEscrowDetails(escrowId);
    
    return {
      buyer: details.buyer,
      seller: details.seller,
      mediator: details.mediator,
      amount: ethers.utils.formatEther(details.amount),
      releaseTime: new Date(details.releaseTime.toNumber() * 1000),
      status: details.status
    };
  }
  
  async confirmDelivery(contractAddress: string, escrowId: number) {
    const contract = await this.getEscrowContract(contractAddress);
    const tx = await contract.confirmDelivery(escrowId);
    return tx.wait();
  }
  
  async refundBuyer(contractAddress: string, escrowId: number) {
    const contract = await this.getEscrowContract(contractAddress);
    const tx = await contract.refundBuyer(escrowId);
    return tx.wait();
  }
  
  async raiseDispute(contractAddress: string, escrowId: number) {
    const contract = await this.getEscrowContract(contractAddress);
    const tx = await contract.raiseDispute(escrowId);
    return tx.wait();
  }
  
  async resolveDispute(contractAddress: string, escrowId: number, releaseToSeller: boolean) {
    const contract = await this.getEscrowContract(contractAddress);
    const tx = await contract.resolveDispute(escrowId, releaseToSeller);
    return tx.wait();
  }
}

export default Web3Service;
