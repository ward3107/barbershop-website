import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './components/LandingPage';
import AdminPage from './components/AdminPage';

function App() {
  // Simple routing based on URL hash
  const isAdminPage = window.location.hash === '#admin' || window.location.pathname === '/admin';

  return (
    <LanguageProvider>
      {isAdminPage ? <AdminPage /> : <LandingPage />}
    </LanguageProvider>
  );
}

export default App;