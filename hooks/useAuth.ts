import { useMutation, useQuery } from '@tanstack/react-query';
import { User } from '@shared/schema';
import { apiRequest, queryClient, getQueryFn } from '../lib/queryClient';
import { useToast } from './use-toast';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegistrationCredentials {
  username: string;
  password: string;
}

export function useAuth() {
  const { toast } = useToast();
  
  // Fetch current user session
  const { 
    data: user, 
    isLoading,
    error, 
    refetch 
  } = useQuery<User | null>({
    queryKey: ['/api/auth/session'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest('POST', '/api/auth/login', credentials);
      return await res.json();
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(['/api/auth/session'], userData);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid credentials',
        variant: 'destructive',
      });
    },
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegistrationCredentials) => {
      const res = await apiRequest('POST', '/api/auth/register', credentials);
      return await res.json();
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(['/api/auth/session'], userData);
      toast({
        title: 'Registration successful',
        description: `Welcome, ${userData.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message || 'Could not create account',
        variant: 'destructive',
      });
    },
  });
  
  // Demo login mutation
  const demoLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/demo-login', {});
      return await res.json();
    },
    onSuccess: (userData: User) => {
      queryClient.setQueryData(['/api/auth/session'], userData);
      toast({
        title: 'Demo login successful',
        description: 'Welcome to the demo account! You can explore all features.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Demo login failed',
        description: error.message || 'Could not access demo account',
        variant: 'destructive',
      });
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/logout', {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/session'], null);
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Logout failed',
        description: error.message || 'Could not log out',
        variant: 'destructive',
      });
    },
  });
  
  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    demoLogin: demoLoginMutation.mutate,
    demoLoginAsync: demoLoginMutation.mutateAsync,
    isDemoLoggingIn: demoLoginMutation.isPending,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    refetchUser: refetch,
  };
}