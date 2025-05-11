import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  Users, 
  Globe, 
  DollarSign, 
  CheckCircle, 
  Package, 
  Landmark,
  AlertCircle
} from 'lucide-react';
import { useContracts } from '@/hooks/useContracts';
import { useDocuments } from '@/hooks/useDocuments';
import { formatDate } from '@/utils/helpers';
import EscrowLifecycle from '@/components/contracts/EscrowLifecycle';

const ContractDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedContract, loading: contractLoading, getContract, approveContract, fundContract, releaseEscrow } = useContracts(id ? parseInt(id) : undefined);
  const { documents, loading: documentsLoading, getDocuments } = useDocuments(id ? parseInt(id) : undefined);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      getContract(parseInt(id));
      getDocuments();
    }
  }, [id]);

  // Helper function to check contract status
  const checkStatus = (statusCheck: string | string[]) => {
    if (!selectedContract) return false;
    
    const status = selectedContract.status.toLowerCase();
    
    if (Array.isArray(statusCheck)) {
      return statusCheck.some(s => status.includes(s.toLowerCase()));
    }
    
    return status.includes(statusCheck.toLowerCase());
  };

  // Handle button actions
  const handleApproveContract = () => {
    if (id) approveContract(parseInt(id));
  };
  
  const handleFundContract = () => {
    if (id) fundContract(parseInt(id));
  };
  
  const handleReleaseEscrow = () => {
    if (id) releaseEscrow(parseInt(id));
  };

  if (contractLoading || !selectedContract) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Link to="/contracts" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2 inline" />
            Back to Contracts
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Loading contract details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/contracts" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2 inline" />
          Back to Contracts
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Contract Details */}
        <div className="lg:w-2/3">
          <div className="rounded-lg border shadow-sm mb-6">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold">{selectedContract.title}</h1>
                  <p className="text-sm text-muted-foreground">
                    Contract #{selectedContract.id}
                    {selectedContract.contractAddress && (
                      <span className="ml-2 font-mono text-xs">
                        ({selectedContract.contractAddress.slice(0, 6)}...{selectedContract.contractAddress.slice(-4)})
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {selectedContract.status}
                </div>
              </div>
              
              <p className="mb-6">
                {selectedContract.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col border rounded-md p-3">
                  <span className="text-xs text-muted-foreground flex items-center mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created On
                  </span>
                  <span className="text-sm">{formatDate(selectedContract.createdAt)}</span>
                </div>
                
                <div className="flex flex-col border rounded-md p-3">
                  <span className="text-xs text-muted-foreground flex items-center mb-1">
                    <Users className="h-3 w-3 mr-1" />
                    Parties
                  </span>
                  <span className="text-sm">{selectedContract.parties.length} parties</span>
                </div>
                
                <div className="flex flex-col border rounded-md p-3">
                  <span className="text-xs text-muted-foreground flex items-center mb-1">
                    <Globe className="h-3 w-3 mr-1" />
                    Incoterm
                  </span>
                  <span className="text-sm">{selectedContract.tradeTerms.incoterm}</span>
                </div>
                
                <div className="flex flex-col border rounded-md p-3">
                  <span className="text-xs text-muted-foreground flex items-center mb-1">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Value
                  </span>
                  <span className="text-sm font-medium">
                    {selectedContract.tradeTerms.value} {selectedContract.tradeTerms.currency}
                  </span>
                </div>
                
                <div className="flex flex-col border rounded-md p-3">
                  <span className="text-xs text-muted-foreground flex items-center mb-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    Delivery Deadline
                  </span>
                  <span className="text-sm">{formatDate(selectedContract.tradeTerms.deliveryDeadline)}</span>
                </div>
                
                <div className="flex flex-col border rounded-md p-3">
                  <span className="text-xs text-muted-foreground flex items-center mb-1">
                    <FileText className="h-3 w-3 mr-1" />
                    Documents
                  </span>
                  <span className="text-sm">{documents.length} documents</span>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex space-x-1 mb-4">
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'details' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Details
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'documents' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveTab('documents')}
                  >
                    Documents
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'logistics' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveTab('logistics')}
                  >
                    Logistics
                  </button>
                  <button 
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTab === 'history' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                    onClick={() => setActiveTab('history')}
                  >
                    History
                  </button>
                </div>
                
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Trade Terms</h3>
                    <div className="space-y-3 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm font-medium">Payment Terms:</span>
                          <p className="text-sm text-muted-foreground">{selectedContract.tradeTerms.paymentTerms}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Currency:</span>
                          <p className="text-sm text-muted-foreground">{selectedContract.tradeTerms.currency}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Dispute Resolution:</span>
                        <p className="text-sm text-muted-foreground">{selectedContract.tradeTerms.disputeResolutionMechanism}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Inspection Period:</span>
                        <p className="text-sm text-muted-foreground">{selectedContract.tradeTerms.inspectionPeriod} days</p>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3">Parties</h3>
                    <div className="space-y-4 mb-6">
                      {selectedContract.parties.map((party, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{party.name}</h4>
                              <p className="text-sm text-muted-foreground">{party.role}</p>
                            </div>
                            <div className="flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100">
                              {party.country}
                            </div>
                          </div>
                          <div className="mt-2 text-xs font-mono text-muted-foreground">
                            {party.address.slice(0, 10)}...{party.address.slice(-8)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                      {checkStatus('draft') && (
                        <button onClick={handleApproveContract} className="px-4 py-2 rounded-md bg-primary text-primary-foreground flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2" /> Approve Contract
                        </button>
                      )}
                      
                      {checkStatus('pendingapproval') && (
                        <button onClick={handleFundContract} className="px-4 py-2 rounded-md bg-primary text-primary-foreground flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" /> Fund Escrow
                        </button>
                      )}
                      
                      {checkStatus('goodsreceived') && (
                        <button onClick={handleReleaseEscrow} className="px-4 py-2 rounded-md bg-primary text-primary-foreground flex items-center">
                          <Landmark className="h-4 w-4 mr-2" /> Release Funds
                        </button>
                      )}
                    </div>
                  </div>
                )}
                
                {activeTab === 'documents' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contract Documents</h3>
                    
                    {documentsLoading ? (
                      <p>Loading documents...</p>
                    ) : documents.length > 0 ? (
                      <div className="space-y-3">
                        {documents.map(doc => (
                          <div key={doc.id} className="flex items-center border rounded-md p-3 hover:bg-muted/30">
                            <div className="h-10 w-10 flex items-center justify-center rounded bg-muted/50 mr-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{doc.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <span>{doc.fileType.toUpperCase()}</span>
                                <span className="mx-1">•</span>
                                <span>{(doc.fileSize / 1000).toFixed(0)} KB</span>
                              </div>
                            </div>
                            <div className="ml-2">
                              {doc.isVerified ? (
                                <div className="flex items-center text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </div>
                              ) : (
                                <div className="flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Pending
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 rounded-lg border-2 border-dashed">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <h4 className="text-lg font-medium mb-1">No documents yet</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Upload the first document to this contract
                        </p>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                          Upload Document
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'logistics' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Logistics Tracking</h3>
                    <div className="text-center py-8 rounded-lg border-2 border-dashed">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <h4 className="text-lg font-medium mb-1">No logistics data</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add logistics tracking to monitor your shipment
                      </p>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                        Add Tracking
                      </button>
                    </div>
                  </div>
                )}
                
                {activeTab === 'history' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Contract History</h3>
                    <div className="relative pl-6">
                      <div className="absolute left-2 top-2 bottom-0 w-px bg-muted-foreground/20"></div>
                      
                      <div className="mb-6 relative">
                        <div className="absolute left-[-18px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                        <h4 className="font-medium">Contract Created</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedContract.createdAt)} by {selectedContract.createdBy}
                        </p>
                      </div>
                      
                      {checkStatus(['pendingapproval', 'awaitingfunds', 'funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) && (
                        <div className="mb-6 relative">
                          <div className="absolute left-[-18px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                          <h4 className="font-medium">Contract Approved</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(new Date(new Date(selectedContract.createdAt).getTime() + 86400000))} by Buyer
                          </p>
                        </div>
                      )}
                      
                      {checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) && (
                        <div className="mb-6 relative">
                          <div className="absolute left-[-18px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background"></div>
                          <h4 className="font-medium">Escrow Funded</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedContract.milestones.funded || new Date())} by Buyer
                          </p>
                          <p className="text-sm">
                            {selectedContract.tradeTerms.value} {selectedContract.tradeTerms.currency} deposited into escrow wallet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar with Escrow Status */}
        <div className="lg:w-1/3">
          <div className="sticky top-6">
            <div className="rounded-lg border shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Escrow Status</h3>
              <div className="mb-4 flex items-center justify-center">
                <div className="text-center">
                  {checkStatus(['funded', 'active', 'goodsshipped', 'goodsreceived', 'completed']) ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <span className="text-lg font-medium">Funded</span>
                    </>
                  ) : checkStatus('completed') ? (
                    <>
                      <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <span className="text-lg font-medium">Released</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                      <span className="text-lg font-medium">Not Funded</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Escrow Lifecycle Component */}
            <EscrowLifecycle 
              status={selectedContract.status}
              contractDate={selectedContract.createdAt}
              escrowAmount={selectedContract.tradeTerms.value}
              escrowCurrency={selectedContract.tradeTerms.currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsPage;