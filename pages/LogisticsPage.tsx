import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

// Redirect logistics page to documents page with logistics tab
const LogisticsPage: React.FC = () => {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to documents page which now contains the logistics tab
    setLocation('/documents');
  }, [setLocation]);
  
  return <div className="p-4">Redirecting to Documents & Logistics...</div>;
};

export default LogisticsPage;