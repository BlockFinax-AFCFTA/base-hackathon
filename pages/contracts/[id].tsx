import { useRouter } from 'next/router';
import Head from 'next/head';
import ContractDetails from '@/components/contracts/ContractDetails';
import { BlockchainSidebar } from '../../components/layout/BlockchainSidebar';

export default function ContractDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <>
      <Head>
        <title>Contract Details | BlockFinaX</title>
      </Head>
      
      <div className="flex min-h-screen">
        <div className="hidden md:flex w-64 flex-col border-r bg-background z-30">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <div className="font-semibold">BlockFinaX</div>
          </div>
          <BlockchainSidebar className="flex-1" />
        </div>
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 lg:gap-6 lg:px-6">
            <div className="flex flex-1 items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold">Contract Details</h1>
                <p className="text-sm text-muted-foreground">
                  View and manage your contract details and logistics
                </p>
              </div>
            </div>
          </header>
          
          <main className="p-4 lg:p-6">
            {id ? (
              <ContractDetails contractId={id as string} />
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
                Contract ID not found. Please go back to contracts page.
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}