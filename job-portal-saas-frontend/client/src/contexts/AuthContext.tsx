import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import {
  User,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  seedDemoAccounts,
} from "../utils/auth";

interface RegisterData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  role?: "user" | "recruiter";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  login: (
    email: string,
    password: string
  ) => ReturnType<typeof loginUser>;

  register: (
    data: RegisterData
  ) => ReturnType<typeof registerUser>;

  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    seedDemoAccounts();

    
    const currentUser = getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    setLoading(false);
  }, []);

  const login = (
    email: string,
    password: string
  ) => {
    const result = loginUser(email, password);

    if (result.success && result.user) {
      setUser(result.user);
    }

    return result;
  };

  const register = (data: RegisterData) => {
    return registerUser({
      fullName: data.fullName,
      email: data.email,
      mobile: data.mobile,
      password: data.password,
      role: data.role || "user",
    });
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const refreshUser = () => {
    setUser(getCurrentUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}