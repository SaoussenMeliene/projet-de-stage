import LogoOriginal from "../assets/logo.png";

const Logo = ({
  size = "medium",
  className = ""
}) => {
  // Utilisation simple du logo original
  const getLogoSrc = () => {
    return LogoOriginal;
  };

  // Classes de taille simples
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "h-6";
      case "medium":
        return "h-8";
      case "large":
        return "h-12";
      case "xl":
        return "h-16";
      default:
        return "h-8";
    }
  };

  return (
    <img
      src={getLogoSrc()}
      alt="Satoripop Challenges"
      className={`object-contain ${getSizeClasses()} ${className}`}
    />
  );
};

export default Logo;
