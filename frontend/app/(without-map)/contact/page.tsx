"use client";
import { useState } from "react";
import { Mail, User } from "react-feather";
import { useRouter } from "next/navigation";

export default function Contact() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);



    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        try {
            const res = await fetch("http://localhost:8081/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setForm({ name: "", email: "", message: "" });
                setIsSuccess(true);
                setIsLoading(false);
                setTimeout(() => {
                    router.push("/");
                }, 1250);
            } else {
                setIsLoading(false);
                alert("Erreur lors de l'envoi !");
            }
        } catch (error) {
            setIsLoading(false);
            alert("Erreur de connexion : " + error);
        }
    };


    return (
        <div className="relative w-full flex flex-col items-center bg-gradient-to-b from-white via-green-50 to-green-100 min-h-screen">
            {/* Form always rendered, even with loader */}
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
                        Nom et Prénom
                    </label>
                    <input
                        type="text"
                        id="formName"
                        name="name"
                        className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 focus:outline-none placeholder:text-green-400"
                        placeholder="Votre nom et prénom"
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
                        className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-300 focus:outline-none placeholder:text-green-400"
                        placeholder="Your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
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
                        placeholder="Your message..."
                        value={form.message}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg shadow transition"
                >
                    Envoyer
                </button>
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
