import { Link } from "react-router-dom";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              HEART <span className="text-accent">FUND</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-accent transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-accent transition-colors">
              Contact
            </Link>
            <Link to="/donate">
              <Button variant="secondary" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                Donate Now
              </Button>
            </Link>
          </div>

          {/* Phone Number */}
          <div className="hidden lg:flex items-center space-x-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg">
            <Phone className="w-4 h-4" />
            <span className="font-semibold ">CALL US</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link
              to="/"
              className="block py-2 hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block py-2 hover:text-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link to="/donate" onClick={() => setIsOpen(false)}>
              <Button variant="secondary" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Donate Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
