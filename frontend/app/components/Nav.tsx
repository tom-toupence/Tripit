"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NavLinks = () => {
    const pathname = usePathname();

    return (
        <>
            {["/", "/about", "/trip"].map((path) => (
                <Link 
                    key={path}
                    href={path}
                    className={`relative group px-4 py-2 transition-colors ${pathname === path ? "text-blue-500" : "hover:text-blue-400"}`}
                >
                    {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}

                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"
                    style={{ transformOrigin: "center" }} ></span>

                </Link>
            ))}
        </>
    );
};

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <nav className="w-1/3 flex justify-end">
                <div className="hidden md:flex w-full justify-between">
                    <NavLinks />
                </div>
                <div className="md:hidden">
                    <button onClick={toggleNavbar} className="p-2">
                        {isOpen ? <X /> : <Menu />}
                    </button> 
                </div>
            </nav>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="flex flex-col items-center basis-full text-white py-4"
                >
                    <NavLinks />
                </motion.div>
            )}
        </>
    );
};

export default Nav;
