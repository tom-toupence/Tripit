"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { API_BASE } from "@/services/constants";

export default function AuthButton() {
    const [user, setUser] = useState<{ email: string; avatarUrl?: string; name?: string } | null>(null);
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
                    setUser({ email: data.email, avatarUrl: data.avatarUrl, name : data.name });
                } else {
                    localStorage.removeItem("jwt");
                    setUser(null);
                }
            })
            .catch(() => setUser(null));
    }, []);

    const handleGoogleLogin = () => {
        router.push("/login");
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        setUser(null);
    };

    const handleProfile = () => {
        router.push("/profile");
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
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full border-2 border-green-400 shadow">
                            <Image
                                src={user.avatarUrl || "/default-avatar.png"}
                                alt="avatar"
                                width={40}
                                height={40}
                            />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="mt-4 z-[1] shadow menu menu-sm translate-x-4 dropdown-content bg-base-100 rounded-box min-w-[120px]"
                    >
                        <li>
                            <span className="font-semibold pointer-events-none select-none">{user.name}</span>
                        </li>
                        <li>
                            <button onClick={handleProfile}>Mon profil</button>
                        </li>
                        <li>
                            <button onClick={handleLogout}>Se déconnecter</button>
                        </li>
                        {/* Ajoute d'autres items ici si tu veux */}
                    </ul>
                </div>
            )}
        </div>
    );
}
