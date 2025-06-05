// NavLinks.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Palette : choisis ta vibe ici !
// 1. Green + Blue
const gradient = "from-green-400 via-cyan-400 to-blue-500";
// 2. Green + Yellow
// const gradient = "from-green-400 via-yellow-300 to-yellow-400";
// 3. Green + Violet
// const gradient = "from-green-400 via-purple-400 to-violet-500";

const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/trip", label: "Trip" },
];

const NavLinks = ({ onClick }: { onClick?: () => void }) => {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <nav
            className="
                flex flex-col md:flex-row
                justify-center items-center
                md:space-x-6
                bg-white/80 dark:bg-black/30 backdrop-blur-xl
                rounded-2xl px-4 py-2 shadow-md ring-1 ring-black/10
            "
            style={{
                WebkitBackdropFilter: 'blur(6px)',
                backdropFilter: 'blur(6px)',
            }}
        >
            {navItems.map(({ path, label }) => {
                const isActive = pathname === path;
                return (
                    <button
                        key={path}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onClick) onClick();
                            if (pathname !== path) router.push(path);
                        }}
                        className={`
                            relative px-4 py-2 mx-1 my-1 rounded-xl transition
                            font-semibold group
                            ${isActive
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-800 dark:text-gray-100 hover:text-green-600/90 dark:hover:text-green-400/90"
                        }
                            ${isActive ? "bg-green-100/80 dark:bg-green-900/40" : "hover:bg-black/10 dark:hover:bg-white/10"}
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500
                        `}
                    >
                        {label}
                        {isActive && (
                            <motion.span
                                layoutId="active-pill"
                                className={`
                                    absolute inset-0 rounded-xl -z-10
                                    bg-gradient-to-tr ${gradient} opacity-70
                                `}
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default NavLinks;
