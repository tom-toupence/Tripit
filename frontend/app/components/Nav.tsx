import Link from "next/link";

const Nav = () => {
    return (
        <>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
        </>
    );
};

export default Nav;
