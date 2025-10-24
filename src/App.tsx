import { useState, useEffect } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import LandingPage from './components/LandingPage';
import AdminPage from './components/AdminPage';

function App() {
  // State to track if we're on admin page
  const [isAdminPage, setIsAdminPage] = useState(
    window.location.hash === '#admin' || window.location.pathname === '/admin'
  );

  // Listen for hash changes (when user clicks admin link)
  useEffect(() => {
    const handleHashChange = () => {
      const isAdmin = window.location.hash === '#admin' || window.location.pathname === '/admin';
      setIsAdminPage(isAdmin);
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Cleanup
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          {isAdminPage ? <AdminPage /> : <LandingPage />}
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;