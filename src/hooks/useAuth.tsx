// src/hooks/useAuth.tsx
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
import { authService, User, AuthResponse } from "@/services/authService";
import { favoritesService } from "@/services/favoritesService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasSyncedFavoritesRef = useRef(false);
  const previousUserRef = useRef<User | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const wasAuthenticated = !!previousUserRef.current;
      const response: AuthResponse = await authService.checkAuth();

      if (response.user) {
        setUser(response.user);
        previousUserRef.current = response.user;

        // If user just signed in (wasn't authenticated before, but now is), sync localStorage favorites
        if (!wasAuthenticated && response.user && !hasSyncedFavoritesRef.current) {
          console.log("User signed in, syncing localStorage favorites to account...");
          hasSyncedFavoritesRef.current = true;
          favoritesService.syncLocalFavoritesToAPI().catch((err) => {
            console.error("Error syncing favorites:", err);
          });
        }
      } else {
        setUser(null);
        previousUserRef.current = null;
        hasSyncedFavoritesRef.current = false; // Reset when user signs out
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
      setError("Failed to check authentication status");
      setUser(null);
      previousUserRef.current = null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    authService.initiateGoogleLogin();
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setUser(null);
        setError(null);
        previousUserRef.current = null;
        hasSyncedFavoritesRef.current = false;
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed");
    }
  };

  // Check authentication on mount and when URL changes
  useEffect(() => {
    const checkAuthOnMount = async () => {
      // Check for auth success in URL params first
      const urlParams = new URLSearchParams(window.location.search);
      const authStatus = urlParams.get("auth");

      if (authStatus === "success") {
        // Remove the auth parameter from URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("auth");
        window.history.replaceState({}, "", newUrl.toString());

        // Wait a bit for session cookie to be set, then check auth
        // This gives the browser time to process the session cookie from the redirect
        setTimeout(async () => {
          await checkAuth();
          // Retry once more after a short delay to ensure we get the user
          setTimeout(async () => {
            const response = await authService.checkAuth();
            if (response.user) {
              setUser(response.user);
            }
          }, 500);
        }, 100);
      } else {
        // Normal auth check on mount
        await checkAuth();
      }
    };

    checkAuthOnMount();
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
