"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
    const router = useRouter();
    const [alreadyLogged, setAlreadyLogged] = useState(false);

    useEffect(() => {
        // Vérifie si un JWT existe
        if (typeof window !== "undefined" && localStorage.getItem("jwt")) {
            setAlreadyLogged(true);
            // Petit délai pour laisser voir le message
            setTimeout(() => {
                router.replace("/");
            }, 1300);
        } else {
            router.push("http://localhost:8081/oauth2/authorization/google");
        }
    }, [router]);

    return (
        <div className="pt-32 flex flex-col items-center justify-center">
            {alreadyLogged ? (
                <>
                    <span className="loading loading-ring w-24 h-24 mb-6"></span>
                    <span className="text-2xl font-semibold mb-2">Tu es déjà connecté !</span>
                    <span className="text-gray-400 text-lg mb-2">Tu vas être redirigé…</span>
                </>
            ) : (
                <>
                    <span className="loading loading-ring w-24 h-24 mb-6"></span>
                    <span className="text-xl font-semibold mb-2">Redirection vers Google…</span>
                    <span className="text-gray-400">Merci de patienter…</span>
                </>
            )}
        </div>
    );
}
