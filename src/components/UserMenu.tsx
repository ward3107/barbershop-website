import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import UserAccount from './UserAccount';

export default function UserMenu() {
  const { currentUser, userProfile } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);

  const handleClick = () => {
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
        className="relative group"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-[#FFD700] to-[#C4A572] rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all">
          {currentUser ? (
            <User className="w-5 h-5 text-black" />
          ) : (
            <LogIn className="w-5 h-5 text-black" />
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute top-full mt-2 right-0 bg-black border border-[#FFD700]/30 rounded-lg px-3 py-2 text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          {currentUser ? (
            <div>
              <p className="text-[#FFD700] font-bold">{userProfile?.displayName}</p>
              <p className="text-gray-400 text-xs">{userProfile?.loyaltyPoints} points</p>
            </div>
          ) : (
            'Login / Sign Up'
          )}
        </div>
      </motion.button>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <UserAccount
        open={accountModalOpen}
        onOpenChange={setAccountModalOpen}
      />
    </>
  );
}
