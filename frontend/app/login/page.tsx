'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import useRouter

const LoginPage = () => {
  const router = useRouter();

  return (
    <div className="lg:flex">
      <div className="lg:w-1/2">
        <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl">
          <h2 className="text-center text-4xl text-green-900 font-display font-semibold lg:text-left xl:text-5xl">
            Log in
          </h2>
          <div className="mt-12">
            <form>
              <div>
                <div className="text-sm font-bold text-gray-700 tracking-wide">Email Address</div>
                <input
                  type="email"
                  placeholder="mail@example.com"
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold text-gray-700 tracking-wide">Password</div>
                  <a className="text-xs font-display font-semibold text-green-600 hover:text-green-800 cursor-pointer">
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="bg-green-600 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none hover:bg-green-700 shadow-lg"
                >
                  Log In
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => signIn('google')}
                  className="flex items-center space-x-2 border border-gray-300 rounded-full px-4 py-2 hover:shadow-md transition"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google logo"
                    className="w-5 h-5"
                  />
                  <span className="text-sm text-gray-700 font-semibold">Log in with Google</span>
                </button>
              </div>
            </form>

            <div className="mt-4 text-sm font-display font-semibold text-gray-700 text-center">
              Don&#39;t have an account?{' '}
              <a
                className="cursor-pointer text-green-600 hover:text-green-800"
                onClick={() => router.push('/register')} 
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center bg-green-100 flex-1 h-[530px]">
        <img src="../assets/images/login.jpg" alt="Login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default LoginPage;
