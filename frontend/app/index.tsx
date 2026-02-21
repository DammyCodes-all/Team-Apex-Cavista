import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function IndexRoute() {
  const { isAuthenticated, isHydrating, hasAuthHistory } = useAuth();

  if (isHydrating) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/onboarding/step-1" />;
  }

  return <Redirect href={hasAuthHistory ? "/auth/login" : "/auth/signup"} />;
}
