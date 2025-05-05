    'use client';

    import React, { useState } from 'react';
    import { useRouter } from 'next/navigation';

    const RegisterPage = () => {

        const router = useRouter();
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            router.push('/register')
            return;
        }

        const payload = {
        name,
        email,
        password,
        };

        setIsSubmitting(true);

        try {
        const response = await fetch('http://localhost:8081/api/auth/register', { 
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('User registered:', data);
            setIsSubmitting(false);
            router.push('/')

        } else {
            const err = await response.json();
            console.error(err);
            alert('Registration failed: ' + err.message);
        }
        } catch (error) {
        console.error(error);
        alert('An error occurred during registration.');
        }
    };

    return (
        <div className="lg:flex h-screen">
        <div className="lg:w-1/2 flex items-center">
            <div className="px-12 sm:px-24 md:px-48 lg:px-12 xl:px-24 xl:max-w-2xl w-full">
            <h2 className="text-center text-4xl text-green-900 font-display font-semibold lg:text-left">
                Create an Account
            </h2>
            <div className="mt-12">
                <form onSubmit={handleSubmit}>
                <div>
                    <div className="text-sm font-bold text-gray-700 tracking-wide">Name</div>
                    <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mt-8">
                    <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                    <input
                    type="email"
                    placeholder="mail@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mt-8">
                    <div className="text-sm font-bold text-gray-700 tracking-wide">Password</div>
                    <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mt-8">
                    <div className="text-sm font-bold text-gray-700 tracking-wide">Confirm Password</div>
                    <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mt-10">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-green-600 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none shadow-lg
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}
                    `}
                    >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
                </form>
                <div className="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
                Already have an account?{' '}
                <a href="/login" className="cursor-pointer text-green-600 hover:text-green-800">
                    Log in
                </a>
                </div>
            </div>
            </div>
        </div>

        <div className="hidden lg:flex items-center justify-center bg-green-100 flex-1 h-full">
            <img src="../assets/images/register.jpg" alt="Register" className="w-full h-full object-cover" />
        </div>
        </div>
    );
    };

    export default RegisterPage;
