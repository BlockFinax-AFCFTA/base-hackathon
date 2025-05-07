import React from 'react';
import { Link } from 'wouter';
import Layout from '../components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { Badge } from '../components/ui/badge';

export default function Home() {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6">Base Network Finance</h1>
        <p className="text-xl text-gray-600 mb-8">
          Your all-in-one platform for blockchain-powered international trade
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            title={t('wallet.title')}
            description={t('wallet.description')}
            link="/wallet"
            badge="Stablecoins"
          />
          <FeatureCard
            title={t('contracts.title')}
            description={t('contracts.description')}
            link="/contracts"
            badge="Smart"
          />
          <FeatureCard
            title={t('documents.title')}
            description={t('documents.description')}
            link="/documents"
            badge="Verified"
          />
          <FeatureCard
            title={t('common.invoices')}
            description={t('invoices.description')}
            link="/invoices"
            badge="Escrow"
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('common.newFeature')}</h2>
          <p className="text-gray-600 mb-4">
            {t('documents.translationFeature')}
          </p>
          <Link href="/document-translator">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              {t('common.tryNow')}
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  link: string;
  badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, link, badge }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && (
            <Badge className="ml-2" variant="secondary">{badge}</Badge>
          )}
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link href={link}>
          <a className="text-blue-600 hover:text-blue-800 font-medium">
            Learn more →
          </a>
        </Link>
      </div>
    </div>
  );
};