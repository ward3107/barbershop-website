import { Scissors, Home, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Logo() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-4 md:gap-8">
      {/* Logo/Brand - Clickable */}
      <a href="#home" className="cursor-pointer">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Scissors className="h-8 w-8 text-[#C4A572]" strokeWidth={2.5} />
          </motion.div>
          <span className="text-2xl font-bold text-[#FFD700] tracking-wider">
            SHOKHA
          </span>
        </motion.div>
      </a>

      {/* Menu Links - Visible on all screens */}
      <div className="flex items-center gap-4 md:gap-6">
        <a
          href="#home"
          className="flex items-center gap-2 text-white hover:text-[#C4A572] transition-colors text-sm md:text-base font-semibold"
        >
          <Home className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">{t('home')}</span>
        </a>
        <a
          href="#gallery"
          className="flex items-center gap-2 text-white hover:text-[#C4A572] transition-colors text-sm md:text-base font-semibold"
        >
          <Image className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">{t('gallery')}</span>
        </a>
      </div>
    </div>
  );
}