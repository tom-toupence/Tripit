import Logo from "./Logo";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className="bg-dark-background sticky top-0 z-[50] mx-auto flex flex-wrap w-full items-center justify-between border-b border-gray-500 p-8">
        <Logo />
        <Nav />
    </header>
  );
};

export default Header;