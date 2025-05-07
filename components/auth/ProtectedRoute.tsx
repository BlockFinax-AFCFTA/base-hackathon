import React from "react";
import { Route, Redirect, RouteProps } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  path: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  path,
  ...rest
}) => {
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

  return (
    <Route
      path={path}
      {...rest}
    >
      {(params) => user ? <Component {...params} /> : <Redirect to="/auth" />}
    </Route>
  );
};