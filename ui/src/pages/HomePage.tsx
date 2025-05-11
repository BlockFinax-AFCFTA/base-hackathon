import React from 'react';
import { Link } from 'wouter';
import { 
  Wallet, 
  FileText, 
  Truck, 
  Receipt, 
  TrendingUp, 
  Upload,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/hooks/useWeb3';
import Header from '@/components/layout/Header';
import { mockContracts } from '@/data/mockContracts';
import { mockEscrows } from '@/data/mockWallet';
import { shortenAddress, formatDate } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, link, icon, color }) => {
  return (
    <Link href={link}>
      <a className="block">
        <Card className="h-full transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              {icon}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="p-0 text-sm" asChild>
              <div className="flex items-center">
                Explore <ChevronRight className="ml-1 h-4 w-4" />
              </div>
            </Button>
          </CardContent>
        </Card>
      </a>
    </Link>
  );
};

const HomePage: React.FC = () => {
  const { isLoggedIn, ethBalance, tokens } = useWeb3();
  
  // Get recent contracts and escrows from mock data
  const recentContracts = mockContracts.slice(0, 3);
  const recentEscrows = mockEscrows.slice(0, 3);

  return (
    <div className="space-y-6">
      <Header 
        title="Welcome to BlockFinaX"
        subtitle="Your blockchain-powered international trade platform"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          title="Wallet"
          description="Manage your on-chain assets and transactions"
          link="/wallet"
          icon={<Wallet className="h-5 w-5 text-white" />}
          color="bg-blue-500"
        />
        <FeatureCard
          title="Contracts"
          description="Create and manage smart trade contracts"
          link="/contracts"
          icon={<FileText className="h-5 w-5 text-white" />}
          color="bg-emerald-500"
        />
        <FeatureCard
          title="Documents"
          description="Store and verify trade documents on blockchain"
          link="/documents"
          icon={<Upload className="h-5 w-5 text-white" />}
          color="bg-violet-500"
        />
        <FeatureCard
          title="Logistics"
          description="Track shipments with blockchain verification"
          link="/logistics"
          icon={<Truck className="h-5 w-5 text-white" />}
          color="bg-amber-500"
        />
      </div>
      
      {isLoggedIn && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Contracts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Recent Contracts
                </CardTitle>
                <CardDescription>Your latest trade contracts</CardDescription>
              </CardHeader>
              <CardContent>
                {recentContracts.length > 0 ? (
                  <div className="space-y-4">
                    {recentContracts.map((contract) => (
                      <div key={contract.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">{contract.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Status: {contract.status}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/contracts/${contract.id}`}>
                            <a>View</a>
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No contracts yet. Create your first one!
                  </div>
                )}
                
                <Button className="mt-4 w-full" variant="outline" asChild>
                  <Link href="/contracts">
                    <a>View All Contracts</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            {/* Active Escrows */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  Active Escrows
                </CardTitle>
                <CardDescription>Escrow wallets for your contracts</CardDescription>
              </CardHeader>
              <CardContent>
                {recentEscrows.length > 0 ? (
                  <div className="space-y-4">
                    {recentEscrows.map((escrow) => (
                      <div key={escrow.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <div className="font-medium">{escrow.contractTitle}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="mr-2">{escrow.amount} {escrow.currency}</span>
                            <span>({escrow.status})</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/contracts/${escrow.contractId}`}>
                            <a>View</a>
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    No active escrows yet.
                  </div>
                )}
                
                <Button className="mt-4 w-full" variant="outline" asChild>
                  <Link href="/wallet">
                    <a>View All Escrows</a>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;