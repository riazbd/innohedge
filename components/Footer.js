import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

const Footer = ({ darkMode }) => {
  return (
    <footer
      className={`py-16 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container px-6 mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Motto */}
          <div>
            <h2 className="text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                Innohed
              </span>
            </h2>
            <p className="mt-2 text-lg opacity-75">
              Innovation redefined, solutions delivered.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6">
            {[
              { name: "Facebook", icon: FaFacebookF },
              { name: "Twitter", icon: FaTwitter },
              { name: "LinkedIn", icon: FaLinkedinIn },
              { name: "Instagram", icon: FaInstagram },
            ].map(({ name, icon: Icon }) => (
              <a
                key={name}
                href="#"
                aria-label={name}
                className="p-2 rounded-full bg-gray-800 hover:bg-indigo-500 transition-colors"
              >
                <Icon className="h-5 w-5 text-white" />
              </a>
            ))}
          </div>
        </div>

        {/* Middle Section */}
        <div className="border-t border-gray-700/30 mt-10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-sm opacity-75">
            © {new Date().getFullYear()} Innohed Limited. All rights reserved.
          </p>
          <ul className="flex space-x-6 text-sm opacity-75">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-indigo-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-10 flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Newsletter */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold">Stay Updated</h3>
            <p className="mt-2 opacity-75">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-500 text-white rounded-r-md hover:bg-indigo-600 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <p className="mt-2 opacity-75">📧 contact@innohed.com</p>
            <p className="mt-2 opacity-75">📞 +1 (123) 456-7890</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
