"use client";

import Logo from "./Logo";
import Nav from "./Nav";
import TripBox from "@/components/Tripbox";
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
    return (
        <header className="fixed top-0 left-0 w-full z-[50] p-3 bg-transparent">
            <div
                className="pointer-events-none absolute inset-0 w-full h-full z-0"
                style={{
                    WebkitMaskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                    backdropFilter: "blur(2px)",
                    background: "rgba(255,255,255,0.07)",
                }}
            />
            <div className="relative z-10 flex w-full items-center justify-between">
                {/* Logo à gauche */}
                <div className="flex items-center min-w-[120px]"> {/* <-- min-w à régler selon ton logo */}
                    <Logo />
                </div>
                {/* Nav centrée */}
                <div className="flex-1 flex justify-center">
                    <Nav />
                </div>
                {/* Actions à droite */}
                <div className="flex items-center min-w-[120px] justify-end space-x-4">
                    {pathname === "/" && <TripBox />}
                </div>
            </div>
        </header>
    );
};

export default Header;
