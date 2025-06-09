"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import {API_BASE} from "@/services/constants";

export default function AuthButton() {
    const [user, setUser] = useState<{ email: string; avatarUrl?: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            setUser(null);
            return;
        }
        fetch(API_BASE + "/auth/status", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => res.ok ? res.json() : Promise.reject())
            .then((data) => {
                if (data.authenticated) {
                    console.log("Réponse de /auth/status :", data);
                    setUser({ email: data.email, avatarUrl: data.avatarUrl });
                } else {
                    console.log("Utilisateur non authentifié");
                    setUser(null);
                }
            })
            .catch(() => setUser(null));
    }, []);

    const handleGoogleLogin = () => {
        router.push("/login");
    };

    // BONUS : bouton de déconnexion (optionnel)
    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
    };

    return (
        <div className="flex flex-row items-center mx-1 min-h-[48px]">
            <div className="w-[2px] h-10 bg-gray-300 mx-4 shadow-sm" />
            {!user ? (
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-10 h-10 bg-white dark:bg-black rounded-full shadow hover:scale-110 transition"
                    title="Connexion Google"
                >
                    <FcGoogle className="w-7 h-7" />
                </button>
            ) : (
                <div className="relative group">
                    <Image
                        src={user.avatarUrl || "/default-avatar.png"}
                        alt="avatar"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-green-400 shadow"
                    />
                    {/* Bouton de logout au hover de l'avatar */}
                    <button
                        onClick={handleLogout}
                        className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Déconnexion"
                        style={{ fontSize: "10px" }}
                    >
                        ×
                    </button>
                </div>
            )}
        </div>
    );
}
