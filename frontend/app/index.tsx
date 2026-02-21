import { Redirect } from "expo-router";

import { useAuth } from "@/contexts/auth-context";

export default function IndexRoute() {
  const { isAuthenticated, isHydrating, hasAuthHistory } = useAuth();

  if (isHydrating) {
    return null;
  }
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href={hasAuthHistory ? "/auth/login" : "/auth/signup"} />;
}
