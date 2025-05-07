import { useRouter } from 'next/router';
import ContractDetails from '@/components/contracts/ContractDetails';

export default function ContractDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Contract Details</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your contract details and logistics
        </p>
      </div>
      
      {id ? (
        <ContractDetails contractId={id as string} />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
          Contract ID not found. Please go back to contracts page.
        </div>
      )}
    </div>
  );
}