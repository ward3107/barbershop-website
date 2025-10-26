import { motion } from 'framer-motion';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-20 py-4 md:py-6 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
    >
      <div className="container mx-auto px-3 md:px-4 flex justify-between items-center gap-2">
        <Logo />
        <div className="flex items-center gap-1 md:gap-4">
          <UserMenu />
          <LanguageSwitcher />
        </div>
      </div>
    </motion.nav>
  );
}