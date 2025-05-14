const Footer = () => {
    return (
      <footer className="bg-[#ffdda6] text-green-900 text-sm py-6 mt-auto border-t border-green-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Tripit. Tous droits réservés.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-end w-full">
            {}
            <a
              href="/about"
              className="relative group px-4 py-2 hover:text-green-600 transition-colors"
            >
              À propos
              <span
                className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600 scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"
                style={{ transformOrigin: "center" }}
              ></span>
            </a>
            <a
              href="/trip"
              className="relative group px-4 py-2 hover:text-green-600 transition-colors"
            >
              Planifier un voyage
              <span
                className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600 scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"
                style={{ transformOrigin: "center" }}
              ></span>
            </a>
            <a
              href="mailto:toupencetom@tripit.com"
              className="relative group px-4 py-2 hover:text-green-600 transition-colors"
            >
              Contact
              <span
                className="absolute left-0 bottom-0 w-full h-0.5 bg-green-600 scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100"
                style={{ transformOrigin: "center" }}
              ></span>
            </a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  