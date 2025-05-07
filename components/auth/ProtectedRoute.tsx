import React, { ComponentType } from "react";
import { Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: ComponentType;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  // Completely bypass authentication - always render the component
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
}