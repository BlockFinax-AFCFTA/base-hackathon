import { createContext, useContext } from "react";
import { User, LoginCredentials, RegisterCredentials } from "../shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient, getQueryFn } from "../lib/queryClient";
import { useToast } from "./use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: ReturnType<typeof useLoginMutation>;
  registerMutation: ReturnType<typeof useRegisterMutation>;
  logoutMutation: ReturnType<typeof useLogoutMutation>;
  demoLoginMutation: ReturnType<typeof useDemoLoginMutation>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function useLoginMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useRegisterMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const { confirmPassword, ...userData } = credentials;
      const res = await apiRequest("POST", "/api/register", userData);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useLogoutMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/logout");
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

function useDemoLoginMutation() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/demo-login");
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Demo login failed");
      }
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Demo login successful",
        description: "You are now logged in as a demo user",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Demo login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthData() {
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();
  const logoutMutation = useLogoutMutation();
  const demoLoginMutation = useDemoLoginMutation();

  return {
    user: user || null,
    isLoading,
    error,
    loginMutation,
    registerMutation,
    logoutMutation,
    demoLoginMutation,
  };
}