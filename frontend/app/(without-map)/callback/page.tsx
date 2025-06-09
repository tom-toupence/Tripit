"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        if (token) {
            localStorage.setItem("jwt", token);
        }
        router.replace("/"); // ou autre
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <span className="loading loading-ring w-24 h-24 mb-6"></span>
            <span className="text-xl font-semibold mb-2">Connexion en cours…</span>
        </div>
    );
}
