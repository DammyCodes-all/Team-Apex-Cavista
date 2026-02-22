import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { post, setAuthToken } from "@/lib/api/client";

const AUTH_STORAGE_KEY = "@team-axle-cavista/auth-session";
const AUTH_HISTORY_STORAGE_KEY = "@team-axle-cavista/auth-history";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
};

export type AuthSession = {
  user: AuthUser;
};

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasAuthHistory: boolean;
  isHydrating: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (payload: LoginPayload) => Promise<boolean>;
  signUp: (payload: SignupPayload) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildSession = (email: string, providedName?: string): AuthSession => ({
  user: {
    id: `${Date.now()}`,
    fullName:
      providedName?.trim() ||
      email
        .split("@")[0]
        ?.replace(/[._-]+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase()) ||
      "User",
    email,
  },
});

const isValidSession = (value: unknown): value is AuthSession => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<AuthSession>;
  return Boolean(
    candidate.user &&
    typeof candidate.user.id === "string" &&
    typeof candidate.user.fullName === "string" &&
    typeof candidate.user.email === "string",
  );
};

type ValidationDetail = {
  msg?: string;
};

type SignupErrorResponse = {
  message?: string;
  error?: string;
  detail?: ValidationDetail[];
};

type LoginErrorResponse = {
  message?: string;
  error?: string;
  detail?: ValidationDetail[] | string;
};

const extractApiErrorMessage = <
  T extends {
    message?: string;
    error?: string;
    detail?: ValidationDetail[] | string;
  },
>(
  caughtError: unknown,
  fallback: string,
) => {
  if (isAxiosError<T>(caughtError)) {
    const detail = caughtError.response?.data?.detail;
    const detailMessage =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.find((item) => item?.msg)?.msg
          : undefined;

    const message = caughtError.response?.data?.message;
    const error = caughtError.response?.data?.error;

    return detailMessage ?? message ?? error ?? caughtError.message ?? fallback;
  }

  if (caughtError instanceof Error) {
    return caughtError.message;
  }

  return fallback;
};

const getLoginErrorMessage = (caughtError: unknown) => {
  return extractApiErrorMessage<LoginErrorResponse>(
    caughtError,
    "Unable to sign in right now",
  );
};

const getSignupErrorMessage = (caughtError: unknown) => {
  return extractApiErrorMessage<SignupErrorResponse>(
    caughtError,
    "Unable to create account right now",
  );
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [hasAuthHistory, setHasAuthHistory] = useState(false);
  const [isHydrating, setIsHydrating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [rawSession, authHistoryValue] = await Promise.all([
          AsyncStorage.getItem(AUTH_STORAGE_KEY),
          AsyncStorage.getItem(AUTH_HISTORY_STORAGE_KEY),
        ]);

        setHasAuthHistory(authHistoryValue === "true");

        if (!rawSession) {
          return;
        }

        const parsedSession = JSON.parse(rawSession) as unknown;

        if (isValidSession(parsedSession)) {
          setSession(parsedSession);
          return;
        }

        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setIsHydrating(false);
      }
    };

    hydrate();
  }, []);

  const persistSession = useCallback(
    async (nextSession: AuthSession | null) => {
      if (!nextSession) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextSession));
    },
    [],
  );

  const persistAuthHistory = useCallback(async () => {
    setHasAuthHistory(true);
    await AsyncStorage.setItem(AUTH_HISTORY_STORAGE_KEY, "true");
  }, []);

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await post<
          {
            access_token?: string;
            token?: string;
            user?: { email: string; fullName?: string };
          },
          LoginPayload
        >("/auth/login", payload);

        const token = response?.access_token || response?.token;
        if (!token) {
          throw new Error("No token in login response");
        }

        const nextSession = buildSession(payload.email);
        setSession(nextSession);
        await Promise.all([
          persistSession(nextSession),
          persistAuthHistory(),
          setAuthToken(token),
        ]);
        return true;
      } catch (caughtError) {
        const message = getLoginErrorMessage(caughtError);
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession, persistAuthHistory],
  );

  const signUp = useCallback(
    async (payload: SignupPayload) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await post<
          {
            access_token?: string;
            token?: string;
            user?: { email: string; fullName?: string };
          },
          { email: string; password: string; name: string }
        >("/auth/signup", {
          email: payload.email,
          password: payload.password,
          name: payload.name,
        });

        const token = response?.access_token || response?.token;
        if (!token) {
          throw new Error("No token in signup response");
        }

        const nextSession = buildSession(payload.email, payload.name);
        setSession(nextSession);
        await Promise.all([
          persistSession(nextSession),
          persistAuthHistory(),
          setAuthToken(token),
        ]);
        return true;
      } catch (caughtError) {
        const message = getSignupErrorMessage(caughtError);
        setError(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [persistAuthHistory, persistSession],
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await post<string>("/auth/logout");
    } catch {
      // Always clear local session even if logout request fails.
    } finally {
      setSession(null);
      await Promise.all([persistSession(null), setAuthToken(null)]);
      setIsLoading(false);
    }
  }, [persistSession]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      hasAuthHistory,
      isHydrating,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      clearError,
    }),
    [
      session,
      hasAuthHistory,
      isHydrating,
      isLoading,
      error,
      signIn,
      signUp,
      signOut,
      clearError,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
