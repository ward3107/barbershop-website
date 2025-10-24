import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import AdminLoginModal from './AdminLoginModal';

export default function Navigation() {
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-0 left-0 right-0 z-20 py-6 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            {/* CROWN ICON - CLICK TO OPEN ADMIN POPUP */}
            <motion.button
              onClick={() => setAdminModalOpen(true)}
              whileHover={{ scale: 1.2, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="relative group"
              title="Admin Login"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C4A572] p-[2px] shadow-lg shadow-[#FFD700]/50">
                <div className="w-full h-full rounded-full bg-black/90 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-[#FFD700]" />
                </div>
              </div>
              {/* Animated pulse ring */}
              <div className="absolute inset-0 rounded-full bg-[#FFD700]/30 animate-ping" />
            </motion.button>

            <UserMenu />
            <LanguageSwitcher />
          </div>
        </div>
      </motion.nav>

      {/* Admin Login Popup Modal */}
      <AdminLoginModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
    </>
  );
}