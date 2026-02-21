import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function IndexRoute() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/onboarding/step-1" : "/auth/login"} />;
}
