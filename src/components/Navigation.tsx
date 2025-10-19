import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Image } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const navItems = [
    { key: 'home', href: '#home', icon: Home },
    { key: 'gallery', href: '#gallery', icon: Image },
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

          {/* Desktop Menu */}
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

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#C4A572] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-black/95 backdrop-blur-md border-t border-[#C4A572]/30 mt-4"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.key}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="flex items-center gap-3 text-white font-semibold text-lg hover:text-[#C4A572] transition-colors py-3 px-4 rounded-lg hover:bg-[#C4A572]/10"
                  >
                    <Icon className="w-5 h-5" />
                    {t(item.key)}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}