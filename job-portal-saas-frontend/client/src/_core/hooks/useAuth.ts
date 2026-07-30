import { useCallback, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    if (redirectOnUnauthenticated) {
      window.location.href = redirectPath || "/login";
    }
  }, [redirectOnUnauthenticated, redirectPath]);

  const state = useMemo(() => ({
    user,
    loading: false,
    error: null,
    isAuthenticated: !!token,
  }), [user, token]);

  return {
    ...state,
    refresh: () => {},
    logout,
  };
}
