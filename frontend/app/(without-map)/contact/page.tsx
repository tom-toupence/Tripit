"use client";
import { useState } from "react";
import { Mail, User } from "react-feather";

export default function Contact() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (e:any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();
        // Remplace ici par ta logique d'envoi
        console.log(form);
        alert("Message sent!");
    };

    return (
        <div className="w-full flex flex-col items-center bg-gradient-to-b from-white via-green-50 to-green-100 min-h-screen">
            <form
                onSubmit={handleSubmit}
                className="bg-white/95 backdrop-blur rounded-2xl shadow-lg p-8 w-full max-w-md border border-green-200"
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
                        placeholder="Your name"
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
        </div>
    );
}
