import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wallet
} from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';
import { Contract, ContractStatus } from '@/types';
import { formatDate } from '@/utils/helpers';

const ContractsPage: React.FC = () => {
  const { contracts, loading, getContracts } = useContracts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    getContracts();
  }, []);

  // Filter contracts based on search term and status filter
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = 
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contract.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? contract.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  // Get status badge styling and icon
  const getStatusBadge = (status: ContractStatus) => {
    let icon;
    let className;
    
    switch (status) {
      case ContractStatus.COMPLETED:
        icon = <CheckCircle className="h-4 w-4 mr-1" />;
        className = "bg-green-100 text-green-800";
        break;
      case ContractStatus.FUNDED:
        icon = <Wallet className="h-4 w-4 mr-1" />;
        className = "bg-blue-100 text-blue-800";
        break;
      case ContractStatus.DRAFT:
        icon = <FileText className="h-4 w-4 mr-1" />;
        className = "bg-gray-100 text-gray-800";
        break;
      case ContractStatus.AWAITING_FUNDS:
        icon = <Clock className="h-4 w-4 mr-1" />;
        className = "bg-amber-100 text-amber-800";
        break;
      case ContractStatus.DISPUTED:
        icon = <AlertCircle className="h-4 w-4 mr-1" />;
        className = "bg-red-100 text-red-800";
        break;
      default:
        icon = <FileText className="h-4 w-4 mr-1" />;
        className = "bg-gray-100 text-gray-800";
    }
    
    return (
      <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {icon}
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contracts</h1>
          <p className="text-sm text-muted-foreground">
            Manage your international trade contracts
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-white rounded-md flex items-center justify-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search contracts..." 
            className="w-full rounded-md border border-input pl-9 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select 
            className="rounded-md border border-input px-3 py-2 text-sm"
            value={statusFilter || ''}
            onChange={(e) => setStatusFilter(e.target.value || null)}
          >
            <option value="">All statuses</option>
            <option value={ContractStatus.DRAFT}>Draft</option>
            <option value={ContractStatus.PENDING_APPROVAL}>Pending Approval</option>
            <option value={ContractStatus.AWAITING_FUNDS}>Awaiting Funds</option>
            <option value={ContractStatus.FUNDED}>Funded</option>
            <option value={ContractStatus.ACTIVE}>Active</option>
            <option value={ContractStatus.COMPLETED}>Completed</option>
            <option value={ContractStatus.DISPUTED}>Disputed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading contracts...</p>
        </div>
      ) : filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map(contract => (
            <Link key={contract.id} to={`/contracts/${contract.id}`}>
              <div className="rounded-lg border bg-card p-5 shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold line-clamp-1">{contract.title}</h3>
                  {getStatusBadge(contract.status)}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {contract.description}
                </p>
                <div className="flex justify-between text-xs">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Created: {formatDate(contract.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <FileText className="h-3 w-3 mr-1" />
                    <span>{contract.documents.length} docs</span>
                  </div>
                </div>
                <div className="text-sm mt-3 pt-3 border-t">
                  <span className="font-medium">{contract.tradeTerms.value} {contract.tradeTerms.currency}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 rounded-lg flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No contracts found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm || statusFilter 
              ? "Try adjusting your search or filters"
              : "Create your first trade contract to get started"
            }
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </button>
        </div>
      )}

      {/* Contract Creation Modal would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New Contract</h2>
            <p className="text-muted-foreground mb-4">
              Modal content would go here with form fields for creating a new contract
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;