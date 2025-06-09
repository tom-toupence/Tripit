// app/login/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
    const router = useRouter();
    useEffect(() => {
         router.push("http://localhost:8081/oauth2/authorization/google");
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <span className="loading loading-ring w-24 h-24 mb-6"></span>
            <span className="text-xl font-semibold mb-2">Redirection vers Google…</span>
            <span className="text-gray-400">Merci de patienter…</span>
        </div>
    );
}
