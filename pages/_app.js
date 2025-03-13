import '../styles/globals.css';
import { useState } from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  return (

    <div className={darkMode ? 'dark' : ''}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Component {...pageProps} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default MyApp;