import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { language } = useLanguage();

  const translations = {
    en: {
      installApp: 'Install App',
      installTitle: 'Install SHOKHA App',
      installDesc: 'Get quick access from your home screen!',
      installButton: 'Install Now',
      laterButton: 'Maybe Later',
      benefits: [
        'Faster access',
        'Works offline',
        'Get notifications',
        'Home screen icon'
      ]
    },
    ar: {
      installApp: 'تثبيت التطبيق',
      installTitle: 'تثبيت تطبيق SHOKHA',
      installDesc: 'احصل على وصول سريع من شاشتك الرئيسية!',
      installButton: 'تثبيت الآن',
      laterButton: 'ربما لاحقاً',
      benefits: [
        'وصول أسرع',
        'يعمل بدون إنترنت',
        'احصل على الإشعارات',
        'أيقونة على الشاشة'
      ]
    },
    he: {
      installApp: 'התקן אפליקציה',
      installTitle: 'התקן את אפליקציית SHOKHA',
      installDesc: 'קבל גישה מהירה ממסך הבית!',
      installButton: 'התקן עכשיו',
      laterButton: 'אולי מאוחר יותר',
      benefits: [
        'גישה מהירה יותר',
        'עובד במצב לא מקוון',
        'קבל התראות',
        'סמל במסך הבית'
      ]
    }
  };

  const text = translations[language as keyof typeof translations];

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed the prompt (within 7 days)
    const dismissedTime = localStorage.getItem('pwa_install_dismissed');
    if (dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show again within 7 days
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 5 seconds on the page
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
      localStorage.setItem('pwa_install_dismissed', Date.now().toString());
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_dismissed', Date.now().toString());
  };

  // Don't render if app is installed or no prompt available
  if (isInstalled || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] md:hidden"
          />

          {/* Install prompt card */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 z-[10000] md:hidden"
          >
            <div className="bg-gradient-to-br from-black via-zinc-900 to-black border-2 border-[#FFD700] rounded-2xl p-6 shadow-2xl shadow-[#FFD700]/20">
              {/* Close button */}
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C4A572] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Smartphone className="w-8 h-8 text-black" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                    {text.installTitle}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {text.installDesc}
                  </p>

                  {/* Benefits */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {text.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]" />
                        {benefit}
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleInstall}
                      className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-[#FFD700]/30 transition-shadow"
                    >
                      <Download className="w-4 h-4" />
                      {text.installButton}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDismiss}
                      className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors"
                    >
                      {text.laterButton}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
