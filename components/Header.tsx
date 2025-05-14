import Logo from "./Logo";
import Nav from "./Nav";

const Header = () => {
  return (
    <header className="bg-[#ffdda6] top-0 z-[50] mx-auto flex flex-wrap w-full items-center justify-between border-gray-500 p-3">
      <Logo />
      <Nav /> 
    </header>
  );
};

export default Header;
