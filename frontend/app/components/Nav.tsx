"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect} from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const NavLinks = () => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
       setIsMounted(true);
     }, []);

  if (!isMounted) return null;

    return (
        <>
            {["/", "/about", "/trip"].map((path) => (
                <Link 
                key={path}
                href={path}
                className={`relative group px-4 py-2 font-semibold ${
                    pathname === path 
                        ? "text-green-600"
                        : "hover:text-green-600 transition-colors"
                }`}
            >
                {path === "/" ? "Home" : path.substring(1).charAt(0).toUpperCase() + path.substring(2)}
            
                <span 
                    className={`absolute left-0 bottom-0 w-full h-0.5 bg-green-600 ${
                        pathname === path
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"
                    }`}
                    style={{ transformOrigin: "center" }}
                ></span>
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
