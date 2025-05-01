import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Language, languageOptions } from '../../context/LanguageContext';

/**
 * I18nDemo component
 * Demonstrates how to use i18next with namespaces
 */
const I18nDemo: React.FC = () => {
  // Use default namespace
  const { t: tDefault } = useLocalization();
  
  // Use specific namespaces
  const { t: tContracts } = useLocalization('contracts');
  const { t: tDocuments } = useLocalization('documents');
  const { t: tWallet } = useLocalization('wallet');
  const { t: tRegulatory } = useLocalization('regulatory');
  
  // Get language information
  const { language, setLanguage } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>I18n Implementation Demo</CardTitle>
          <CardDescription>
            This component demonstrates how to use i18next with namespaces for different parts of the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div>
              <label className="text-sm font-medium block mb-2">Current Language</label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.code} value={option.code}>
                      <span className="flex items-center">
                        <span className="mr-2">{option.flag}</span>
                        <span>{option.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-500">
              Try switching languages to see the translations in action
            </p>
          </div>
          
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Default namespace translations</h3>
                <p className="text-gray-600 mb-4">
                  These translations use the default namespace from the main translation file
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">App title</p>
                    <p className="text-xl">{tDefault('app.title')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: app.title</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">App slogan</p>
                    <p className="text-xl">{tDefault('app.slogan')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: app.slogan</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Dashboard title</p>
                    <p className="text-xl">{tDefault('dashboard.overview')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: dashboard.overview</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Action buttons</p>
                    <div className="flex gap-2">
                      <Button size="sm">{tDefault('actions.save')}</Button>
                      <Button size="sm" variant="outline">{tDefault('actions.cancel')}</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: actions.save, actions.cancel</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contracts">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contracts namespace translations</h3>
                <p className="text-gray-600 mb-4">
                  These translations use the contracts namespace from the contracts translation file
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Contracts title</p>
                    <p className="text-xl">{tContracts('contracts.title')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: contracts.title</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Contract statuses</p>
                    <div className="space-y-2">
                      <p>{tContracts('contracts.status.draft')}</p>
                      <p>{tContracts('contracts.status.awaitingFunds')}</p>
                      <p>{tContracts('contracts.status.completed')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: contracts.status.*</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Contract actions</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">{tContracts('contracts.create')}</Button>
                      <Button size="sm" variant="outline">{tContracts('contracts.view')}</Button>
                      <Button size="sm" variant="outline">{tContracts('contracts.edit')}</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: contracts.create, contracts.view, contracts.edit</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Empty state</p>
                    <p>{tContracts('contracts.noContracts')}</p>
                    <p>{tContracts('contracts.createNew')}</p>
                    <p className="text-sm text-gray-500 mt-1">Keys: contracts.noContracts, contracts.createNew</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documents namespace translations</h3>
                <p className="text-gray-600 mb-4">
                  These translations use the documents namespace from the documents translation file
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Documents title</p>
                    <p className="text-xl">{tDocuments('documents.title')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: documents.title</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Document actions</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">{tDocuments('documents.upload')}</Button>
                      <Button size="sm" variant="outline">{tDocuments('documents.verify')}</Button>
                      <Button size="sm" variant="outline">{tDocuments('documents.share')}</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: documents.upload, documents.verify, documents.share</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Document statuses</p>
                    <div className="space-y-2">
                      <p>{tDocuments('documents.status.active')}</p>
                      <p>{tDocuments('documents.status.pending')}</p>
                      <p>{tDocuments('documents.status.verified')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: documents.status.*</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Empty state</p>
                    <p>{tDocuments('documents.noDocuments')}</p>
                    <p>{tDocuments('documents.uploadNew')}</p>
                    <p className="text-sm text-gray-500 mt-1">Keys: documents.noDocuments, documents.uploadNew</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="wallet">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Wallet namespace translations</h3>
                <p className="text-gray-600 mb-4">
                  These translations use the wallet namespace from the wallet translation file
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Wallet title</p>
                    <p className="text-xl">{tWallet('wallet.title')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: wallet.title</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Wallet actions</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">{tWallet('wallet.deposit')}</Button>
                      <Button size="sm" variant="outline">{tWallet('wallet.withdraw')}</Button>
                      <Button size="sm" variant="outline">{tWallet('wallet.transfer')}</Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: wallet.deposit, wallet.withdraw, wallet.transfer</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Transaction types</p>
                    <div className="space-y-2">
                      <p>{tWallet('wallet.transaction.sent')}</p>
                      <p>{tWallet('wallet.transaction.received')}</p>
                      <p>{tWallet('wallet.transaction.deposited')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: wallet.transaction.*</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Wallet types</p>
                    <div className="space-y-2">
                      <p>{tWallet('wallet.mainWallet')}</p>
                      <p>{tWallet('wallet.escrowWallet')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: wallet.mainWallet, wallet.escrowWallet</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="regulatory">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Regulatory namespace translations</h3>
                <p className="text-gray-600 mb-4">
                  These translations use the regulatory namespace from the regulatory translation file
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Regulatory title</p>
                    <p className="text-xl">{tRegulatory('regulatory.title')}</p>
                    <p className="text-sm text-gray-500 mt-1">Key: regulatory.title</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Regulatory labels</p>
                    <div className="space-y-2">
                      <p>{tRegulatory('regulatory.documentation')}</p>
                      <p>{tRegulatory('regulatory.tariffs')}</p>
                      <p>{tRegulatory('regulatory.compliance')}</p>
                      <p>{tRegulatory('regulatory.restrictions')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: regulatory.*</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Form fields</p>
                    <div className="space-y-2">
                      <p>{tRegulatory('regulatory.product')}</p>
                      <p>{tRegulatory('regulatory.origin')}</p>
                      <p>{tRegulatory('regulatory.destination')}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Keys: regulatory.product, regulatory.origin, regulatory.destination</p>
                  </div>
                  
                  <div className="p-4 border rounded">
                    <p className="font-medium mb-2">Actions</p>
                    <Button>{tRegulatory('regulatory.analyze')}</Button>
                    <p className="text-sm text-gray-500 mt-1">Key: regulatory.analyze</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default I18nDemo;