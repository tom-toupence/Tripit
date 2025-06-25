import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import { API_BASE } from '@/services/constants';

type User = {
    name: ReactNode;
    email: string;
    avatarUrl?: string;
};

type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) return;

        fetch(`${API_BASE}/auth/status`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) setUser(data);
                else setUser(null);
            })
            .catch(() => setUser(null));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
