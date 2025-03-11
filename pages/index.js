import Head from 'next/head';
import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home({ darkMode, setDarkMode }) {
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
      await axios.post('http://localhost:5000/api/forms/submit', { ...formData, recaptchaToken });
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
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
      <Head>
        <title>Innohed Limited | Innovation Redefined</title>
        <meta name="description" content="Leading innovation in technology solutions for businesses worldwide." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Hero Section with Gradient Background */}
      <div 
        className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100'}`}
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-animation 15s ease infinite'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${darkMode ? 'bg-white opacity-5' : 'bg-indigo-600 opacity-5'}`}
              animate={{
                x: [Math.random() * 100, Math.random() * 100],
                y: [Math.random() * 100, Math.random() * 100],
                scale: [Math.random() + 0.5, Math.random() + 0.5]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 20 + Math.random() * 10
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

        <Navbar darkMode={darkMode} setDarkMode={setDarkMode}/>

        {/* Hero Content */}
        <div className="container px-6 mx-auto flex flex-col md:flex-row items-center justify-between h-screen">
          <motion.div 
            className="md:w-1/2 pt-24 md:pt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
              <span className="block">Redefining</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">Innovation</span>
            </h2>
            <p className="text-xl mb-8 max-w-lg opacity-90">
              We create cutting-edge solutions that transform businesses and drive growth in the digital era.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-3 rounded-full font-medium border-2 ${darkMode ? 'border-white/30 hover:border-white/60' : 'border-indigo-600/30 hover:border-indigo-600/60'} transition-all`}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 mt-12 md:mt-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ 
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="relative w-full max-w-lg mx-auto">
              <motion.div
                animate={{ 
                  rotateY: [0, 5, 0, -5, 0],
                  rotateX: [0, -5, 0, 5, 0]
                }}
                transition={{ 
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 8,
                  ease: "easeInOut"
                }}
              >
                <div className={`rounded-2xl overflow-hidden shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className={`h-48 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'} flex items-center justify-center`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-24 w-24 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="p-6">
                    <div className="h-2 bg-indigo-400 rounded w-1/4 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2 w-5/6"></div>
                    <div className="h-2 bg-gray-200 rounded mb-2 w-4/6"></div>
                    <div className="h-8 bg-indigo-100 rounded mt-6"></div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements around the main image */}
              <div className="absolute -top-8 -right-8 w-16 h-16 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 shadow-lg"></div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg"></div>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </div>

      {/* Services Section */}
      <section className={`py-24 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`} id="services">
        <div className="container px-6 mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h3 variants={itemVariants} className="text-lg font-semibold text-indigo-600 mb-2">Our Services</motion.h3>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">What We Excel At</motion.h2>
            <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg opacity-80">
              We provide cutting-edge solutions tailored to your business needs, helping you stay ahead in the digital world.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Web Development",
                description: "Modern, responsive websites and web applications built with cutting-edge technologies.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                )
              },
              {
                title: "Mobile Applications",
                description: "Native and cross-platform mobile apps that deliver exceptional user experiences.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "AI Solutions",
                description: "Smart applications powered by machine learning and artificial intelligence.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.6, 
                      delay: index * 0.2,
                      ease: "easeOut"
                    }
                  }
                }}
              >
                <motion.div 
                  className={`h-full p-8 rounded-2xl ${darkMode ? 'bg-gray-800 hover:bg-gray-800/80' : 'bg-white hover:bg-indigo-50'} shadow-lg transition-colors duration-300`}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl ${darkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="opacity-80">{service.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={`py-24 ${darkMode ? 'bg-gray-800' : 'bg-white'}`} id="contact">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
              className="text-center mb-12"
            >
              <motion.h3 variants={itemVariants} className="text-lg font-semibold text-indigo-600 mb-2">Get In Touch</motion.h3>
              <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-4">Contact Us</motion.h2>
              <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg opacity-80">
                Have a question or want to work together? Reach out to us and we'll get back to you as soon as possible.
              </motion.p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}
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
                      className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 focus:border-indigo-500'} border focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
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
                      className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 focus:border-indigo-500'} border focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80">Message</label>
                  <textarea
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className={`w-full p-3 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 focus:border-indigo-500' : 'bg-gray-50 border-gray-200 focus:border-indigo-500'} border focus:ring-2 focus:ring-indigo-200 outline-none transition-all`}
                    required
                  />
                </div>
                
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="6LeATPAqAAAAAMiaFc_PXt4gQaUvMRw7QdN0e6-W"
                    onChange={setRecaptchaToken}
                    theme={darkMode ? 'dark' : 'light'}
                  />
                </div>
                
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'} transition-all`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
                
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-green-100 text-green-800 text-center"
                  >
                    Thank you! Your message has been sent successfully.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer darkMode={darkMode}/>

      {/* Global CSS */}
      <style jsx global>{`
        * {
          font-family: 'Poppins', sans-serif;
        }
        
        @keyframes gradient-animation {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
      `}</style>
    </div>
  );
}