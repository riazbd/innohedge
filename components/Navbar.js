import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set to true if token exists
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/"); // Redirect to homepage
  };

  return (
    <header
      className={`py-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-gradient-to-r from-gray-900/95 via-indigo-900/95 to-purple-900/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container px-6 mx-auto flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold font-orbitron tracking-tight">
            <a href="/" className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
              InnoHedge
            </a>
          </h1>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-10">
          {['Home', 'Markets', 'Contact'].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -4, scale: 1.05, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.5)' }}
              className="font-medium font-orbitron text-white list-none"
            >
              <a href={item === "Home" ? "/" : `#${item.toLowerCase()}`} className="hover:text-yellow-400 transition-all duration-300">
                {item}
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-yellow-400 hover:text-yellow-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex space-x-4">
          {isLoggedIn ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold font-orbitron shadow-lg hover:shadow-xl transition-all"
            >
              Logout
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/register")}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold font-orbitron shadow-lg hover:shadow-xl transition-all"
              >
                Sign Up
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#ffd700' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="px-6 py-2 rounded-full font-semibold font-orbitron border-2 border-yellow-500 text-yellow-500 hover:text-yellow-400 hover:border-yellow-400 transition-all"
              >
                Log In
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-lg shadow-2xl rounded-b-lg mt-2 p-6 border-t border-yellow-500/30"
        >
          <ul className="space-y-6">
            {['Home', 'Markets', 'Contact'].map((item) => (
              <li key={item} className="font-medium font-orbitron">
                <a
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  className="block text-white hover:text-yellow-400 transition-colors duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              </li>
            ))}
            <li className="pt-4 border-t border-gray-700">
              {isLoggedIn ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-full bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold font-orbitron shadow-lg hover:shadow-xl transition-all"
                >
                  Logout
                </motion.button>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push("/register");
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-full bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold font-orbitron shadow-lg hover:shadow-xl transition-all mb-4"
                  >
                    Sign Up
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      router.push("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full py-2 rounded-full font-semibold font-orbitron border-2 border-yellow-500 text-yellow-500 hover:text-yellow-400 hover:border-yellow-400 transition-all"
                  >
                    Log In
                  </motion.button>
                </>
              )}
            </li>
          </ul>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;