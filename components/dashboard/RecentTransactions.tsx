import React from 'react';
import { Plus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const RecentTransactions = () => {
  return (
    <div className="mt-6">
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-medium">Transaction Ledger</h3>
            <p className="text-sm text-gray-500">Recent escrow contract activities and settlements</p>
          </div>
          <Link href="/contracts/new">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-gray-500">No transactions yet</p>
            <p className="text-sm text-gray-400 mt-1">Your transaction history will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentTransactions;