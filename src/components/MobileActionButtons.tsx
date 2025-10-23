import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, Navigation, Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MobileActionButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();

  // Replace with your actual business details
  const businessPhone = '+972123456789'; // Your phone number
  const whatsappNumber = '+972123456789'; // Your WhatsApp number
  const wazeLink = 'https://waze.com/ul?ll=32.0853,34.7818&navigate=yes'; // Your location

  const handleCall = () => {
    window.location.href = `tel:${businessPhone}`;
  };

  const handleWhatsApp = () => {
    const message = language === 'ar'
      ? 'مرحباً، أود حجز موعد في SHOKHA'
      : language === 'he'
      ? 'שלום, אני רוצה לקבוע תור ב-SHOKHA'
      : 'Hello, I would like to book an appointment at SHOKHA';

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleWaze = () => {
    window.open(wazeLink, '_blank');
  };

  const actions = [
    {
      id: 'call',
      icon: <Phone className="w-5 h-5" />,
      label: language === 'ar' ? 'اتصل' : language === 'he' ? 'התקשר' : 'Call',
      color: 'from-green-500 to-green-600',
      onClick: handleCall
    },
    {
      id: 'whatsapp',
      icon: <MessageCircle className="w-5 h-5" />,
      label: language === 'ar' ? 'واتساب' : language === 'he' ? 'WhatsApp' : 'WhatsApp',
      color: 'from-green-400 to-green-500',
      onClick: handleWhatsApp
    },
    {
      id: 'waze',
      icon: <Navigation className="w-5 h-5" />,
      label: language === 'ar' ? 'طريق' : language === 'he' ? 'ניווט' : 'Navigate',
      color: 'from-blue-500 to-blue-600',
      onClick: handleWaze
    }
  ];

  return (
    <div className="fixed bottom-32 left-4 z-[9998] md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{
                  delay: index * 0.3,
                  duration: 0.5,
                  exit: { duration: 0.4 }
                }}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`group relative bg-gradient-to-r ${action.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 pr-4 pl-4 py-3`}
              >
                <span className="flex items-center justify-center w-10 h-10">
                  {action.icon}
                </span>
                <span className="font-medium text-sm whitespace-nowrap pr-2">
                  {action.label}
                </span>

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-br from-[#FFD700] to-[#C4A572] text-black rounded-full shadow-xl hover:shadow-2xl hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse animation when closed */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-[#FFD700] animate-ping opacity-20" />
        )}
      </motion.button>
    </div>
  );
}
