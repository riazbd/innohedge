import Head from 'next/head';
import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Track scroll for parallax effects
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/forms/submit`, { ...formData, recaptchaToken });
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <Head>
        <title>Inohedge | The Future of Trading</title>
        <meta name="description" content="Trade cryptocurrencies, stocks, and forex with the world's most advanced trading platform." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Poppins:wght@300;400;600&display=swap" rel="stylesheet" />
      </Head>

      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900">
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full opacity-20"
              animate={{
                x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ repeat: Infinity, duration: 5 + i, ease: 'linear' }}
              style={{
                width: `${20 + i * 10}px`,
                height: `${20 + i * 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <Navbar />

        {/* Hero Content */}
        <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between min-h-screen pt-20">
          <motion.div
            className="md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-orbitron leading-tight mb-6">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600">InnoHedge</span>
              <span className="block">Your Trading Revolution</span>
            </h1>
            <p className="text-xl mb-8 max-w-lg mx-auto md:mx-0 opacity-80">
              Experience lightning-fast trades, real-time analytics, and unmatched security in the world of crypto, stocks, and forex.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                Start Trading
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, borderColor: '#ffd700' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full font-semibold border-2 border-yellow-500 text-yellow-500 hover:text-yellow-400 transition-all"
              >
                Explore Markets
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/2 mt-12 md:mt-0 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <motion.div
              className="relative z-10 bg-gray-800 rounded-2xl p-6 shadow-2xl border border-yellow-500/30"
              animate={{ rotate: [0, 2, -2, 0], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            >
              <div className="h-48 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-t-2xl flex items-center justify-center">
                <svg className="h-24 w-24 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="p-4 space-y-2">
                <div className="h-2 bg-yellow-500 rounded w-1/3"></div>
                <div className="h-2 bg-gray-600 rounded w-5/6"></div>
                <div className="h-2 bg-gray-600 rounded w-4/6"></div>
                <div className="h-6 bg-indigo-600 rounded mt-4"></div>
              </div>
            </motion.div>
            {/* Floating Orbs */}
            <motion.div
              className="absolute top-0 -right-12 w-20 h-20 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-50"
              animate={{ y: [-20, 20], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <motion.div
              className="absolute -bottom-12 -left-12 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-600 opacity-50"
              animate={{ y: [20, -20], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>

      {/* Markets Section */}
      <section className="py-24 bg-gray-900" id="markets">
        <div className="container px-6 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h3 variants={itemVariants} className="text-lg font-semibold text-yellow-500 font-orbitron">Our Markets</motion.h3>
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 font-orbitron">Trade Your Way</motion.h2>
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg opacity-80">
              Access a diverse range of markets with real-time data and lightning-fast execution.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cryptocurrency',
                description: 'Trade Bitcoin, Ethereum, and hundreds of altcoins with zero slippage.',
                icon: (
                  <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
              },
              {
                title: 'Stocks',
                description: 'Invest in global companies with fractional shares and advanced charting.',
                icon: (
                  <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
              {
                title: 'Forex',
                description: 'Trade currency pairs with leverage and tight spreads.',
                icon: (
                  <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                ),
              },
            ].map((market, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.2, ease: 'easeOut' } },
                }}
              >
                <motion.div
                  className="p-8 rounded-2xl bg-gray-800 hover:bg-gray-700 shadow-xl border border-yellow-500/20 transition-all"
                  whileHover={{ y: -10, boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-yellow-500/10">{market.icon}</div>
                  <h3 className="text-xl font-bold mb-3 font-orbitron">{market.title}</h3>
                  <p className="opacity-80">{market.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-indigo-900" id="contact">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={containerVariants}
              className="text-center mb-12"
            >
              <motion.h3 variants={itemVariants} className="text-lg font-semibold text-yellow-500 font-orbitron">Support</motion.h3>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 font-orbitron">Contact Us</motion.h2>
              <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg opacity-80">
                Need assistance with your trades? Our 24/7 support team is here to help.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-gray-800 shadow-2xl border border-yellow-500/30"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-80">Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 opacity-80">Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Message</label>
                  <textarea
                    placeholder="How can we assist you with your trading?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 outline-none transition-all"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="6Lf0i_MqAAAAAGnPGasCI1vMC6KQ18FLMzdtAnT8"
                    onChange={setRecaptchaToken}
                    theme="dark"
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-yellow-500 to-pink-600 text-black font-semibold ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'} transition-all`}
                >
                  {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </motion.button>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-green-600/20 text-green-400 text-center"
                  >
                    Thank you! Your inquiry has been sent successfully.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Global CSS */}
      <style jsx global>{`
        * {
          font-family: 'Poppins', sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Orbitron', sans-serif;
        }
        body {
          background: #0a0a23;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}