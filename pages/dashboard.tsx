import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWeb3 } from '../hooks/useWeb3';
import { useRiskAssessment } from '../hooks/useRiskAssessment';
import DashboardStats from '../components/dashboard/DashboardStats';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const { user, isLoggedIn, isInitializing } = useWeb3();
  const { riskData, isLoading: isLoadingRisk } = useRiskAssessment();
  
  // If not logged in and not initializing, redirect to login
  React.useEffect(() => {
    if (!isLoggedIn && !isInitializing) {
      router.push('/');
    }
  }, [isLoggedIn, isInitializing, router]);
  
  // Loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // Not logged in
  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <>
      <Head>
        <title>Dashboard | BlockFinaX</title>
      </Head>
      
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.username}</p>
        </div>
        
        {/* Dashboard Stats */}
        <DashboardStats />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Transactions */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest activity on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
          
          {/* Risk Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Intelligence</CardTitle>
              <CardDescription>Your risk exposure overview</CardDescription>
            </CardHeader>
            <CardContent>
              {!isLoadingRisk && riskData ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Overall Risk Score</p>
                    <p className="text-sm font-medium">{riskData.overallRisk.score}/100</p>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        riskData.overallRisk.score < 30
                          ? 'bg-green-500'
                          : riskData.overallRisk.score < 70
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${riskData.overallRisk.score}%` }}
                    />
                  </div>
                  
                  <div className="pt-2 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Risk Factors</p>
                    {riskData.riskFactors.map((factor, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <p className="text-sm">{factor.name}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            factor.level === 'low'
                              ? 'bg-green-100 text-green-800'
                              : factor.level === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {factor.level.charAt(0).toUpperCase() + factor.level.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;