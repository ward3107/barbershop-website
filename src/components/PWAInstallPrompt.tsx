import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa_install_dismissed');
      if (!dismissed) {
        // Show prompt after 10 seconds
        setTimeout(() => setShowPrompt(true), 10000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  const texts = {
    en: {
      title: 'Install SHOKHA App',
      description: 'Add to your home screen for quick access and offline booking',
      install: 'Install',
      later: 'Maybe Later'
    },
    ar: {
      title: 'تثبيت تطبيق SHOKHA',
      description: 'أضف إلى الشاشة الرئيسية للوصول السريع والحجز دون اتصال',
      install: 'تثبيت',
      later: 'لاحقاً'
    },
    he: {
      title: 'התקן את אפליקציית SHOKHA',
      description: 'הוסף למסך הבית לגישה מהירה והזמנה לא מקוונת',
      install: 'התקן',
      later: 'אולי מאוחר יותר'
    }
  };

  const text = texts[language as keyof typeof texts];

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[10000]"
      >
        <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/50 rounded-xl shadow-2xl shadow-[#FFD700]/20 overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#C4A572] rounded-xl flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-black" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-[#FFD700] mb-1">
                  {text.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {text.description}
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstall}
                    className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold py-2.5 px-4 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {text.install}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDismiss}
                    className="px-4 py-2.5 border border-[#FFD700]/30 text-gray-300 rounded-lg hover:border-[#FFD700]/60 hover:text-white transition-all"
                  >
                    {text.later}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Animated border glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-transparent to-[#FFD700]/20 animate-pulse" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
