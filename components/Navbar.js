"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Help", href: "/help" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-white text-2xl md:text-3xl font-bold tracking-wide hover:text-blue-400 transition duration-300"
        >
          <span className="text-blue-400">Result</span>Sync
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-10">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-lg font-medium transition duration-300 ${
                  pathname === link.href
                    ? "text-blue-400 border-b-2 border-blue-400 pb-1"
                    : "text-gray-200 hover:text-blue-400"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <ul className="flex flex-col space-y-3 px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg transition duration-300 ${
                    pathname === link.href
                      ? "text-blue-400 font-semibold"
                      : "text-gray-200 hover:text-blue-400"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
