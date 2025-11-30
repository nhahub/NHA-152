import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">E-Commerce</Link>
      </div>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/become-seller">Become a seller</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/auth">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
