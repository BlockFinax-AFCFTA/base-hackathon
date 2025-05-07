import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { Link } from 'wouter';
import { 
  ArrowRight, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  LockKeyhole, 
  Unlock, 
  FileCheck, 
  ShieldCheck,
  Download
} from 'lucide-react';
import { shortenAddress } from '../../lib/utils';

interface EscrowWalletProps {
  escrows: EscrowItem[];
  isLoading?: boolean;
}

interface EscrowItem {
  id: number;
  contractId: number;
  contractTitle: string;
  escrowAddress: string;
  amount: string;
  currency: string;
  status: 'FUNDED' | 'RELEASED' | 'PENDING' | 'DISPUTED';
  createdAt: Date;
  updatedAt: Date;
  releaseConditions?: string;
  parties: {
    buyer: string;
    seller: string;
  };
  relatedDocs?: {
    id: number;
    name: string;
    url: string;
    fileType: string;
  }[];
  txHash?: string;
}

const EscrowWallet: React.FC<EscrowWalletProps> = ({ escrows = [], isLoading = false }) => {
  const { t } = useTranslation();
  const [selectedEscrow, setSelectedEscrow] = useState<EscrowItem | null>(null);

  // Status badge styles
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FUNDED':
        return <Badge variant="success">{t('wallet.funded')}</Badge>;
      case 'RELEASED':
        return <Badge variant="secondary">{t('wallet.released')}</Badge>;
      case 'PENDING':
        return <Badge variant="warning">{t('wallet.pending')}</Badge>;
      case 'DISPUTED':
        return <Badge variant="destructive">{t('wallet.disputed')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'FUNDED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'RELEASED':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'DISPUTED':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{t('wallet.escrowWallet')}</h2>
        </div>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-3"></div>
          <div className="h-12 bg-gray-200 rounded mb-3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('wallet.escrowWallet')}</h2>
        <div className="text-sm text-gray-500">
          {t('contracts.contractEscrow')}
        </div>
      </div>

      {escrows.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500 mb-4">{t('wallet.noEscrows')}</p>
          <Link href="/contracts">
            <a className="inline-flex items-center text-blue-600 hover:text-blue-800">
              {t('contracts.createContract')} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">{t('contracts.title')}</th>
                  <th className="px-6 py-3 text-left">{t('wallet.address')}</th>
                  <th className="px-6 py-3 text-right">{t('wallet.amount')}</th>
                  <th className="px-6 py-3 text-center">{t('common.status')}</th>
                  <th className="px-6 py-3 text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {escrows.map((escrow) => (
                  <tr 
                    key={escrow.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEscrow(escrow)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium">#{escrow.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{escrow.contractTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono">{shortenAddress(escrow.escrowAddress)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium">
                        {escrow.amount} {escrow.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(escrow.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Link href={`/contracts/${escrow.contractId}`}>
                        <a className="text-blue-600 hover:text-blue-900">
                          <ExternalLink className="h-4 w-4 inline" />
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Escrow Details Modal */}
          {selectedEscrow && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <h3 className="text-lg font-semibold flex items-center">
                    {getStatusIcon(selectedEscrow.status)}
                    <span className="ml-2">Escrow #{selectedEscrow.id}</span>
                  </h3>
                  <button 
                    onClick={() => setSelectedEscrow(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('contracts.title')}</div>
                      <div className="font-medium">{selectedEscrow.contractTitle}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('common.status')}</div>
                      <div>{getStatusBadge(selectedEscrow.status)}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('wallet.escrowAddress')}</div>
                      <div className="font-mono">{selectedEscrow.escrowAddress}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('wallet.amount')}</div>
                      <div className="font-medium">{selectedEscrow.amount} {selectedEscrow.currency}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('wallet.createdAt')}</div>
                      <div>{formatDate(selectedEscrow.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('wallet.updatedAt')}</div>
                      <div>{formatDate(selectedEscrow.updatedAt)}</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-sm text-gray-500">{t('wallet.releaseConditions')}</div>
                    <div className="bg-gray-50 p-3 rounded border">
                      {selectedEscrow.releaseConditions || t('wallet.standardContractConditions')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-500">{t('wallet.buyer')}</div>
                      <div className="font-mono">{shortenAddress(selectedEscrow.parties.buyer)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{t('wallet.seller')}</div>
                      <div className="font-mono">{shortenAddress(selectedEscrow.parties.seller)}</div>
                    </div>
                  </div>
                  
                  {/* Transaction Information */}
                  {selectedEscrow.txHash && (
                    <div className="mb-4 bg-blue-50 rounded p-3 border border-blue-100 flex items-start space-x-3">
                      <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-blue-800 mb-1">Blockchain Transaction</div>
                        <div className="flex items-center">
                          <span className="text-sm text-blue-700 font-mono mr-2">{shortenAddress(selectedEscrow.txHash, 10, 8)}</span>
                          <a 
                            href={`https://basescan.org/tx/${selectedEscrow.txHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Related Documents */}
                  {selectedEscrow.relatedDocs && selectedEscrow.relatedDocs.length > 0 && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2">{t('documents.relatedDocuments')}</div>
                      <div className="space-y-2 border rounded divide-y">
                        {selectedEscrow.relatedDocs.map(doc => (
                          <div key={doc.id} className="p-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100">
                            <div className="flex items-center">
                              <FileCheck className="h-5 w-5 text-blue-500 mr-3" />
                              <div>
                                <div className="font-medium">{doc.name}</div>
                                <div className="text-xs text-gray-500">{doc.fileType.toUpperCase()}</div>
                              </div>
                            </div>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center space-x-3 pt-4 border-t">
                    <div>
                      {selectedEscrow.status === 'FUNDED' && (
                        <button
                          className="flex items-center text-green-600 px-3 py-1 border border-green-500 rounded hover:bg-green-50"
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Release Funds
                        </button>
                      )}
                      {selectedEscrow.status === 'PENDING' && (
                        <button
                          className="flex items-center text-blue-600 px-3 py-1 border border-blue-500 rounded hover:bg-blue-50"
                        >
                          <LockKeyhole className="h-4 w-4 mr-2" />
                          Fund Escrow
                        </button>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setSelectedEscrow(null)}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        {t('common.close')}
                      </button>
                      <Link href={`/contracts/${selectedEscrow.contractId}`}>
                        <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                          {t('contracts.viewContract')}
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EscrowWallet;