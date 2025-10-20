import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import AdminPage from './components/AdminPage';

function App() {
  // Simple routing based on URL hash
  const isAdminPage = window.location.hash === '#admin' || window.location.pathname === '/admin';

  return (
    <LanguageProvider>
      <AuthProvider>
        {isAdminPage ? <AdminPage /> : <LandingPage />}
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;