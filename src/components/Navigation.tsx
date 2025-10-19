import { motion } from 'framer-motion';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute top-0 left-0 right-0 z-20 py-6 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Logo />
        <LanguageSwitcher />
      </div>
    </motion.nav>
  );
}