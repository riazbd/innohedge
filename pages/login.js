import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Login({ darkMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        rememberMe,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col">
        <Navbar darkMode={darkMode} />
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 relative">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full ${
                  darkMode
                    ? "bg-indigo-500 opacity-30"
                    : "bg-indigo-600 opacity-50"
                }`}
                animate={{
                  x: [Math.random() * 100, Math.random() * 100],
                  y: [Math.random() * 100, Math.random() * 100],
                  scale: [Math.random() + 0.5, Math.random() + 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 20 + Math.random() * 10,
                }}
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="card w-full max-w-md relative z-10 shadow-xl rounded-xl bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50 pointer-events-none" />

            <div className="p-8 relative">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                  className="flex justify-center mb-5"
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center ring-4 ring-indigo-100 dark:ring-gray-800 transition-all duration-300 group-hover:ring-indigo-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </motion.div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Please sign in to your account
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-300 border border-red-200 dark:border-red-800"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 transition-colors duration-300 group-focus-within:text-indigo-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 transition-colors duration-300 group-focus-within:text-indigo-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-700"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 focus:ring-2 border-gray-200 dark:border-gray-700 transition-colors duration-300"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300 select-none">
                      Remember Me
                    </span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
                  >
                    Forgot Password?
                  </a>
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:from-indigo-700 hover:to-purple-700"
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              <div className="mt-8 text-center text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  New here?{" "}
                  <a
                    href="/register"
                    className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-300"
                  >
                    Create an account
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer darkMode={darkMode} />
    </div>
  );
}
