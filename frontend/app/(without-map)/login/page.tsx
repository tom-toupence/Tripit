"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import {API_BASE} from "@/services/constants";

export default function AuthButton() {
    const [user, setUser] = useState<{ email: string, avatarUrl?: string } | null>(null);
    const router = useRouter();


    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            setUser(null);
            return;
        }
        fetch(API_BASE +"/api/auth/status", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => {
                console.log("Réponse de /api/auth/status :", data); // 👈 ici tu vois tout dans ta console navigateur
                setUser(data);
            })
            .catch(() => setUser(null));
    }, []);

    const handleGoogleLogin = () => {
        router.push("/login");
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
                <Image
                    src={user.avatarUrl || "/default-avatar.png"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-green-400 shadow"
                />
            )}
        </div>
    );
}
