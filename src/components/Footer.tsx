const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="text-center md:text-left">
            <span className="text-2xl font-display font-bold">
              🥟 Samosa House
            </span>
            <p className="text-primary-foreground/70 mt-2 text-sm">
              Authentic Indian Street Food
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} Samosa House. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;