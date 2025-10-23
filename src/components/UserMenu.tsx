import { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import UserAccount from './UserAccount';

export default function UserMenu() {
  const { currentUser, userProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const handleClick = () => {
    console.log('Button clicked!');
    console.log('Current User:', currentUser);
    console.log('User Profile:', userProfile);
    if (currentUser) {
      setAccountModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all text-sm md:text-base"
      >
        {currentUser ? (
          <div className="flex items-center gap-1.5 md:gap-2">
            <User className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">{userProfile?.displayName || 'Account'}</span>
          </div>
        ) : (
          <span className="hidden sm:inline">Login / Sign Up</span>
        )}

        {/* Mobile: Show only icon for login */}
        {!currentUser && (
          <User className="w-4 h-4 sm:hidden" />
        )}

        {/* Tooltip for logged in user */}
        {currentUser && (
          <div className="absolute top-full mt-2 right-0 bg-black border border-[#FFD700]/30 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            <p className="text-[#FFD700] font-bold">{userProfile?.displayName}</p>
            <p className="text-gray-400 text-xs">{userProfile?.loyaltyPoints} points</p>
          </div>
        )}
      </motion.button>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <UserAccount
        open={accountModalOpen}
        onOpenChange={setAccountModalOpen}
      />
    </>
  );
}
