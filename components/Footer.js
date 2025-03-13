import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-16 bg-gradient-to-t from-gray-950 via-indigo-950 to-gray-900 text-white">
      <div className="container px-6 mx-auto">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Motto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold font-orbitron">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">
                InnoHedge
              </span>
            </h2>
            <p className="mt-2 text-lg opacity-75 font-poppins">
              Empowering wealth through cutting-edge trading.
            </p>
          </motion.div>

          {/* Social Icons */}
          <div className="flex space-x-6">
            {[
              { name: "Facebook", icon: FaFacebookF, href: "#" },
              { name: "Twitter", icon: FaTwitter, href: "#" },
              { name: "LinkedIn", icon: FaLinkedinIn, href: "#" },
              { name: "Instagram", icon: FaInstagram, href: "#" },
            ].map(({ name, icon: Icon, href }) => (
              <motion.a
                key={name}
                href={href}
                aria-label={name}
                whileHover={{ scale: 1.2, boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)" }}
                className="p-2 rounded-full bg-gray-800 hover:bg-yellow-500/80 transition-all duration-300"
              >
                <Icon className="h-5 w-5 text-white" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Middle Section */}
        <div className="border-t border-yellow-500/20 mt-10 pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm font-poppins"
          >
            © {new Date().getFullYear()} InnoHedge. All rights reserved.
          </motion.p>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 text-sm opacity-75 font-poppins">
            {["Privacy Policy", "Terms of Service", "Risk Disclosure"].map((item) => (
              <motion.li
                key={item}
                whileHover={{ color: "#ffd700", translateY: -2 }}
                transition={{ duration: 0.3 }}
              >
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  {item}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-10 flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full md:w-1/2"
          >
            <h3 className="text-xl font-bold font-orbitron text-yellow-400">Market Updates</h3>
            <p className="mt-2 opacity-75 font-poppins">
              Subscribe for real-time trading insights and news.
            </p>
            <form className="mt-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold font-orbitron rounded-r-lg hover:bg-yellow-600 transition-all"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full md:w-1/2"
          >
            <h3 className="text-xl font-bold font-orbitron text-yellow-400">Get in Touch</h3>
            <p className="mt-2 opacity-75 font-poppins">📧 support@innohedge.com</p>
            <p className="mt-2 opacity-75 font-poppins">📞 +1 (800) INNOHEDGE</p>
            <p className="mt-2 opacity-75 font-poppins">🌍 Global 24/7 Support</p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;