import '../styles/globals.css';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Component {...pageProps} darkMode={darkMode} setDarkMode={setDarkMode} />
    </div>
  );
}

export default MyApp;