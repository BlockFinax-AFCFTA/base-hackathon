import React from 'react';
import { Link } from 'wouter';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotFoundPageProps {
  customMessage?: string;
}

const NotFoundPage: React.FC<NotFoundPageProps> = ({ 
  customMessage = "We couldn't find the page you were looking for." 
}) => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-yellow-100 p-3 text-yellow-600">
        <AlertTriangle size={32} />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Page Not Found</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        {customMessage}
      </p>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button asChild>
          <Link href="/">
            <a className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </a>
          </Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;