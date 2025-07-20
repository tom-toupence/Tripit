"use client";
import { useEffect, useState } from "react";
import { Mail, User } from "react-feather";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/services/constants";

export default function Contact() {
    const { user } = useAuth() ?? {};
    const router = useRouter();

    // States du formulaire
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Pré-remplit l'email si connecté
    useEffect(() => {
        if (user && user.email) {
            setForm((prev) => ({
                ...prev,
                email: user.email,
            }));
        }
    }, [user]);

    // Redirection si non connecté
    useEffect(() => {
        // Si on vient juste de logout, on laisse le Link router sans rediriger vers login
        if (localStorage.getItem("justLoggedOut")) return;
        if (user === null) {
            router.replace("/login");
        }
    }, [user, router]);

// Après navigation, on nettoie le flag (utile pour tous les composants)
    useEffect(() => {
        if (localStorage.getItem("justLoggedOut")) {
            localStorage.removeItem("justLoggedOut");
        }
    }, []);

    // Bloque tout le rendu tant que user n'est pas prêt ou pas connecté
    if (user === undefined || user === null) {
        return (
            <div className="flex flex-1 w-full h-[60vh] items-center justify-center">
                <svg className="animate-spin h-10 w-10 text-green-400" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
            </div>
        );
    }

    // Gère les changements du formulaire
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Gère la soumission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);
        setErrorMsg("");
        try {
            const res = await fetch(API_BASE + '/contact', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setForm({ name: "", email: "", message: "" });
                setIsSuccess(true);
                setIsLoading(false);
                setTimeout(() => {
                    setIsSuccess(false);
                    router.push("/");
                }, 1250);
            } else {
                setIsLoading(false);
                setErrorMsg("Le message n'a pas pu être envoyé. Réessayez plus tard !");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setIsLoading(false);
            setErrorMsg("Le message n'a pas pu être envoyé. Réessayez plus tard !");
        }
    };

    // Rendu du composant
    return (
        <div className="relative w-full flex flex-col items-center bg-gradient-to-b from-white via-green-50 to-green-100 min-h-screen">
            <form
                onSubmit={handleSubmit}
                className={`bg-white/95 backdrop-blur rounded-2xl shadow-lg p-8 w-full max-w-md border border-green-200 transition-all duration-300
                    ${isLoading || isSuccess ? "opacity-50 blur-sm pointer-events-none" : "opacity-100 pointer-events-auto"}
                `}
            >
                <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
                    Contacte-moi
                </h1>
                {/* Name */}
                <div className="mb-4">
                    <label
                        htmlFor="formName"
                        className="flex items-center gap-2 mb-1 text-green-700"
                    >
                        <User className="w-5 h-5 text-green-500" />
                        Nom
                    </label>
                    <input
                        type="text"
                        id="formName"
                        name="name"
                        className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 focus:outline-none placeholder:text-green-400"
                        placeholder="Votre nom"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* Email */}
                <div className="mb-4">
                    <label
                        htmlFor="formEmail"
                        className="flex items-center gap-2 mb-1 text-green-700"
                    >
                        <Mail className="w-5 h-5 text-green-500" />
                        Email
                    </label>
                    <input
                        type="email"
                        id="formEmail"
                        name="email"
                        className={`w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 focus:outline-none placeholder:text-green-400 ${user ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""}`}
                        placeholder="Votre email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        readOnly={!!user}
                    />
                    {user && (
                        <div className="text-xs text-green-700 mt-1">
                            Connecté en tant que <span className="font-semibold">{user.name}</span>
                        </div>
                    )}
                </div>
                {/* Message */}
                <div className="mb-6">
                    <label
                        htmlFor="formMessage"
                        className="mb-1 block text-green-700"
                    >
                        Message
                    </label>
                    <textarea
                        id="formMessage"
                        name="message"
                        className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 focus:outline-none placeholder:text-green-400"
                        rows={6}
                        placeholder="Votre message..."
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow transition disabled:opacity-60"
                >
                    Envoyer
                </button>
                {errorMsg && (
                    <div className="mt-4 text-red-600 text-center font-medium bg-red-50 p-2 rounded">
                        {errorMsg}
                    </div>
                )}
            </form>
            {/* Loader modal */}
            {(isLoading || isSuccess) && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-[320px] pointer-events-auto">
                        {isLoading && (
                            <>
                                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <span className="text-lg font-semibold text-green-700">Envoi du message...</span>
                            </>
                        )}
                        {isSuccess && (
                            <span className="text-lg font-semibold text-green-700">Le message a été envoyé !</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
