import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  FileText, 
  Upload, 
  Receipt, 
  Truck,
  ArrowRight
} from 'lucide-react';
import { useWeb3 } from '@/hooks/useWeb3';

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, link, icon, badge }) => {
  return (
    <Link to={link} className="block">
      <div className="relative rounded-lg border bg-card p-6 text-card-foreground shadow hover:shadow-md transition-shadow">
        {badge && (
          <div className="absolute right-4 top-4">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              {badge}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="mt-4 flex items-center text-sm text-primary">
          <span>View details</span>
          <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </div>
    </Link>
  );
};

const HomePage: React.FC = () => {
  const { user } = useWeb3();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to BlockFinaX</h1>
        <p className="text-muted-foreground">
          Your blockchain-powered platform for international trade
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <FeatureCard
          title="Wallet"
          description="Manage your digital assets and stablecoins for international trade"
          link="/wallet"
          icon={<Wallet className="h-5 w-5 text-primary" />}
          badge="Stablecoins"
        />
        <FeatureCard
          title="Contracts"
          description="Create and manage smart contracts for secure trade agreements"
          link="/contracts"
          icon={<FileText className="h-5 w-5 text-primary" />}
          badge="Smart"
        />
        <FeatureCard
          title="Documents"
          description="Securely store and verify trade documents with blockchain validation"
          link="/documents"
          icon={<Upload className="h-5 w-5 text-primary" />}
          badge="Verified"
        />
        <FeatureCard
          title="Invoices"
          description="Generate and track invoices linked to your trade contracts"
          link="/invoices"
          icon={<Receipt className="h-5 w-5 text-primary" />}
          badge="Automated"
        />
        <FeatureCard
          title="Logistics"
          description="Track shipments and verify delivery with blockchain validation"
          link="/logistics"
          icon={<Truck className="h-5 w-5 text-primary" />}
          badge="Tracked"
        />
      </div>

      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border bg-primary text-primary-foreground">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium">Create a Trade Contract</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Define your trade terms, parties, and conditions in a secure digital contract
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border bg-primary text-primary-foreground">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium">Fund the Escrow</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Securely deposit funds that will be released upon delivery confirmation
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border bg-primary text-primary-foreground">
              3
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium">Track Logistics</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Monitor your shipment with real-time, blockchain-verified tracking
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full border bg-primary text-primary-foreground">
              4
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium">Verify Documents</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload and verify essential trade documents with blockchain security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;