"use client";
import { useEffect } from "react";

export default function LoginRedirect() {
    useEffect(() => {
        // Redirection vers ton backend Spring
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }, []);

    return (
        <div className="pt-24 flex flex-col items-center justify-center">
            <span className="loading loading-ring w-32 h-32 mb-8"></span>
            <span className="text-2xl font-semibold mb-2">Redirection vers Google…</span>
            <span className="text-gray-400 text-lg">Merci de patienter…</span>
        </div>
    );
}
