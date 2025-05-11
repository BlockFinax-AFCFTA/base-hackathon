import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NotFoundProps {
  customMessage?: string;
}

const NotFoundPage: React.FC<NotFoundProps> = ({ customMessage }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        {customMessage || "The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link 
        to="/" 
        className="mt-8 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;