import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <LanguageProvider>
      <LandingPage />
    </LanguageProvider>
  );
}

export default App;