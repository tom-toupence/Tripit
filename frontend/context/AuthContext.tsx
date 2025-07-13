// context/AuthContext.tsx
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { API_BASE } from "@/services/constants";

export type User = { email: string; name: string; avatarUrl?: string; role: string };

interface AuthContextValue {
    user: User | null | undefined;
    setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextValue>({ user: undefined, setUser: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User|null|undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            setUser(null);
            return;
        }
        fetch(API_BASE + "/auth/status", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                if (data.authenticated) {
                    setUser({ email: data.email, name: data.name, avatarUrl: data.avatarUrl, role: data.role });
                } else {
                    localStorage.removeItem("jwt");
                    setUser(null);
                }
            })
            .catch(() => {
                setUser(null);
            });
    }, []);

    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
