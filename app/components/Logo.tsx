import logo from '../../assets/images/Logo.png';

const Logo = () => {
    return (
        <div className="logo h-16 w-16">
            <img src={logo.src} alt="logo" />
        </div>
    );
};

export default Logo;
