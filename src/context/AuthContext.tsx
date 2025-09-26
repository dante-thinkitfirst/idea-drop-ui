import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  user: { id: string; name: string; email: string } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { accessToken: newToken, user } = await refreshAccessToken();
        setAccessToken(newToken);
        setUser(user);
        setStoredAccessToken(newToken);
      } catch (error: any) {
        console.log("Load auth failed: ", error.message);
      }
    };
    loadAuth();
  }, []);

  //Keep the client and server in sync
  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
