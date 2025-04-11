import { apiRequest } from '@/lib/queryClient';
import { EscrowContract, ContractStatus, Party, TradeTerms } from '../types/contract';

export class ContractService {
  async getContracts(): Promise<EscrowContract[]> {
    const response = await apiRequest('GET', '/api/contracts');
    return response.json();
  }
  
  async getContractById(id: string): Promise<EscrowContract | null> {
    try {
      const response = await apiRequest('GET', `/api/contracts/${id}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching contract ${id}:`, error);
      return null;
    }
  }
  
  async createContract(contractData: Partial<EscrowContract>): Promise<EscrowContract> {
    const response = await apiRequest('POST', '/api/contracts', contractData);
    return response.json();
  }
  
  async updateContract(id: string, contractData: Partial<EscrowContract>): Promise<EscrowContract> {
    const response = await apiRequest('PATCH', `/api/contracts/${id}`, contractData);
    return response.json();
  }
  
  async updateContractStatus(id: string, status: ContractStatus): Promise<EscrowContract> {
    return this.updateContract(id, { status });
  }
  
  async addPartyToContract(id: string, party: Party): Promise<EscrowContract> {
    const contract = await this.getContractById(id);
    if (!contract) throw new Error('Contract not found');
    
    const updatedParties = [...contract.parties, party];
    return this.updateContract(id, { parties: updatedParties });
  }
  
  async updateTradeTerms(id: string, tradeTerms: TradeTerms): Promise<EscrowContract> {
    return this.updateContract(id, { tradeTerms });
  }
  
  async addMilestone(id: string, milestoneKey: string, date: Date): Promise<EscrowContract> {
    const contract = await this.getContractById(id);
    if (!contract) throw new Error('Contract not found');
    
    const updatedMilestones = {
      ...contract.milestones,
      [milestoneKey]: date
    };
    
    return this.updateContract(id, { milestones: updatedMilestones });
  }
}

export default ContractService;
