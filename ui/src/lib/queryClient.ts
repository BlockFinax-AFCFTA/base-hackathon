import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// This is a dummy implementation just to mimic the interface
// This will be replaced by direct imports from mock data in this UI-only version
export const apiRequest = async (
  url: string,
  options?: RequestInit
) => {
  console.log(`API request to ${url} would be sent in a real app`);
  // In real app, this would fetch from API
  return null;
};