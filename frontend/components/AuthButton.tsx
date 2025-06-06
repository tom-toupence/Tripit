"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc"; // Google Icon
import { useRouter } from "next/navigation"; // Utilisé pour la redirection

export default function AuthButton() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Appelle ton backend pour savoir si l'utilisateur est loggé
        fetch("/api/auth/status") // à adapter selon ton endpoint
            .then((res) => res.json())
            .then((data) => {
                setIsAuthenticated(data.authenticated);
                setAvatarUrl(data.avatarUrl || null);
            });
    }, []);

    const handleGoogleLogin = () => {
        // Redirige vers le backend Spring pour login Google
        router.push("/login");
    };

    return (
        <div className="flex flex-row items-center mx-1 min-h-[48px]">
            {/* Barre verticale */}
            <div className="w-[2px] h-10 bg-gray-300 mx-4 shadow-sm" />
            {/* Bouton ou Avatar */}
            {!isAuthenticated ? (
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center w-10 h-10 bg-white dark:bg-black rounded-full shadow hover:scale-110 transition"
                    title="Connexion Google"
                >
                    <FcGoogle className="w-7 h-7" />
                </button>
            ) : (
                <Image
                    src={avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-green-400 shadow"
                />
            )}
        </div>
    );
}
