import { motion } from 'framer-motion';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navigation() {
  const { t } = useLanguage();
  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'gallery', href: '#gallery' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-20 py-6 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-12">
          <Logo />

          <div className="hidden md:flex gap-12">
            {navItems.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="text-white font-semibold text-base hover:text-[#C4A572] transition-colors duration-300 relative group"
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#C4A572] group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </div>

        <LanguageSwitcher />
      </div>
    </motion.nav>
  );
}