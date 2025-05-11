import { useState } from 'react';
import { Contract, ContractStatus } from '@/types';
import { contracts } from '@/data/mockData';
import { delay } from '@/utils/helpers';

export const useContracts = (contractId?: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allContracts, setAllContracts] = useState<Contract[]>(contracts);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    contractId ? contracts.find(c => c.id === contractId) || null : null
  );

  // Function to get all contracts (mock)
  const getContracts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(800);
      
      // Use mock data
      setAllContracts(contracts);
      return contracts;
    } catch (err) {
      setError('Failed to fetch contracts');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Function to get a single contract by ID (mock)
  const getContract = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(500);
      
      // Find contract in mock data
      const contract = contracts.find(c => c.id === id);
      
      if (!contract) {
        throw new Error('Contract not found');
      }
      
      setSelectedContract(contract);
      return contract;
    } catch (err) {
      setError('Failed to fetch contract details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to create a new contract (mock)
  const createContract = async (data: Partial<Contract>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(1000);
      
      // Create new contract (mock)
      const newContract: Contract = {
        id: allContracts.length + 1,
        title: data.title || 'New Contract',
        description: data.description || '',
        status: ContractStatus.DRAFT,
        parties: data.parties || [],
        tradeTerms: data.tradeTerms || {
          incoterm: 'FOB',
          paymentTerms: 'Letter of Credit',
          currency: 'USDC',
          value: '0',
          deliveryDeadline: new Date(),
          inspectionPeriod: 5,
          disputeResolutionMechanism: 'Arbitration'
        },
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'user_demo',
        milestones: {
          created: new Date()
        }
      };
      
      // Update state
      setAllContracts(prev => [...prev, newContract]);
      setSelectedContract(newContract);
      
      return newContract;
    } catch (err) {
      setError('Failed to create contract');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to update a contract (mock)
  const updateContract = async (id: number, data: Partial<Contract>) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await delay(800);
      
      // Find contract
      const contractIndex = allContracts.findIndex(c => c.id === id);
      
      if (contractIndex === -1) {
        throw new Error('Contract not found');
      }
      
      // Update contract (mock)
      const updatedContract: Contract = {
        ...allContracts[contractIndex],
        ...data,
        updatedAt: new Date()
      };
      
      // Update state
      const updatedContracts = [...allContracts];
      updatedContracts[contractIndex] = updatedContract;
      
      setAllContracts(updatedContracts);
      setSelectedContract(updatedContract);
      
      return updatedContract;
    } catch (err) {
      setError('Failed to update contract');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Functions to update contract status (mock)
  const approveContract = async (id: number) => {
    return updateContract(id, { 
      status: ContractStatus.PENDING_APPROVAL 
    });
  };
  
  const fundContract = async (id: number) => {
    return updateContract(id, { 
      status: ContractStatus.FUNDED,
      milestones: {
        ...selectedContract?.milestones || { created: new Date() },
        funded: new Date()
      }
    });
  };
  
  const markGoodsShipped = async (id: number) => {
    return updateContract(id, { 
      status: ContractStatus.GOODS_SHIPPED,
      milestones: {
        ...selectedContract?.milestones || { created: new Date() },
        shipped: new Date()
      }
    });
  };
  
  const confirmGoodsReceived = async (id: number) => {
    return updateContract(id, { 
      status: ContractStatus.GOODS_RECEIVED,
      milestones: {
        ...selectedContract?.milestones || { created: new Date() },
        received: new Date()
      }
    });
  };
  
  const releaseEscrow = async (id: number) => {
    return updateContract(id, { 
      status: ContractStatus.COMPLETED,
      milestones: {
        ...selectedContract?.milestones || { created: new Date() },
        completed: new Date()
      }
    });
  };
  
  const disputeContract = async (id: number) => {
    return updateContract(id, { 
      status: ContractStatus.DISPUTED,
      milestones: {
        ...selectedContract?.milestones || { created: new Date() },
        disputed: new Date()
      }
    });
  };

  return {
    loading,
    error,
    contracts: allContracts,
    selectedContract,
    getContracts,
    getContract,
    createContract,
    updateContract,
    // Contract status updates
    approveContract,
    fundContract,
    markGoodsShipped,
    confirmGoodsReceived,
    releaseEscrow,
    disputeContract
  };
};