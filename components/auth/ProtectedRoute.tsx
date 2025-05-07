import React, { ComponentType } from "react";
import { Route, Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

type ProtectedRouteProps = {
  path: string;
  component: ComponentType;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Skipping authentication check for now as we removed login pages
  if (!user) {
    return (
      <Route path={path}>
        <Component />
      </Route>
    );
  }

  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}