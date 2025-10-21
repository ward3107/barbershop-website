import { useState, useRef, useEffect } from 'react';
import { Scissors, Home, Image, ChevronDown, MessageSquare, Navigation, Phone, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Logo() {
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { key: 'home', href: '#home', icon: Home },
    { key: 'gallery', href: '#gallery', icon: Image },
    { key: 'videogallery', href: '#videos', icon: Video },
    { key: 'reviews', href: '#reviews', icon: MessageSquare },
    { key: 'location', href: '#location', icon: Navigation },
    { key: 'callus', href: 'tel:0527412003', icon: Phone, external: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Logo/Brand - Dropdown Trigger */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="cursor-pointer"
      >
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
          <motion.div
            animate={{ rotate: dropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-5 h-5 text-[#C4A572]" />
          </motion.div>
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-md border border-[#C4A572]/50 rounded-lg shadow-2xl overflow-hidden z-50 min-w-[200px]"
          >
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.a
                  key={item.key}
                  href={item.href}
                  onClick={() => setDropdownOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:text-[#FFD700] hover:bg-[#C4A572]/20 transition-colors font-semibold"
                >
                  <Icon className="w-5 h-5" />
                  {t(item.key)}
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}