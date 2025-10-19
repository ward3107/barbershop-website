import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black border-t-2 border-[#C4A572]"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white text-sm md:text-base">
              {t('cookieMessage')}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={declineCookies}
                variant="outline"
                className="border-[#C4A572] text-white hover:bg-[#C4A572] hover:text-black"
              >
                {t('decline')}
              </Button>
              <Button
                onClick={acceptCookies}
                className="bg-[#C4A572] hover:bg-[#D4B582] text-black"
              >
                {t('accept')}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}