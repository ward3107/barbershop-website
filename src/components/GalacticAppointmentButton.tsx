import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Crown, Gem } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GalacticAppointmentButton({ onClick }: { onClick: () => void }) {
  const { language } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const buttonText = {
    ar: 'احجز موعدك',
    en: 'Book Your Appointment',
    he: 'הזמן תור'
  };

  return (
    <div className="relative group perspective-1000">
      {/* Luxury golden glow backdrop */}
      <div className="absolute -inset-4 bg-gradient-to-r from-[#C4A572]/20 via-[#FFD700]/10 to-[#C4A572]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Golden particles floating */}
      <AnimatePresence>
        {isHovered && Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            initial={{
              x: 0,
              y: 0,
              scale: 0,
              opacity: 0
            }}
            animate={{
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 100,
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            <Gem className="w-3 h-3 text-[#FFD700]" />
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        className="relative overflow-hidden rounded-2xl transform-gpu transition-all duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered
            ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * -0.1}deg) translateZ(10px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
      >
        {/* Base black mirror finish */}
        <div className="absolute inset-0 bg-black rounded-2xl" />

        {/* Golden mirror gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/30 via-[#C4A572]/20 to-[#FFD700]/30 rounded-2xl" />

        {/* Animated golden shimmer effect - diagonal sweep */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(105deg,
              transparent 40%,
              rgba(255, 215, 0, 0.6) 45%,
              rgba(196, 165, 114, 0.4) 50%,
              rgba(255, 215, 0, 0.6) 55%,
              transparent 60%
            )`,
            backgroundSize: '200% 200%',
            animation: isHovered ? 'golden-sweep 2s infinite' : 'none',
          }}
        />

        {/* Mirror reflection effect */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(255, 215, 0, 0.3) 0%,
              transparent 50%
            )`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />

        {/* Premium glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 rounded-2xl" />

        {/* Golden border - triple layer for luxury */}
        <div className="absolute inset-0 rounded-2xl border border-[#FFD700]/50" />
        <div className="absolute inset-[1px] rounded-2xl border border-[#C4A572]/30" />
        <div className="absolute inset-[2px] rounded-2xl border border-[#FFD700]/20" />

        {/* Content */}
        <div className="relative z-10 px-16 py-8 flex items-center gap-6">
          {/* Left crown icon */}
          <motion.div
            animate={{
              rotate: isHovered ? [0, -5, 5, -5, 5, 0] : 0,
              scale: isHovered ? 1.15 : 1
            }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <Crown className="w-8 h-8 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]" />
          </motion.div>

          {/* Main text with golden effect */}
          <div className="flex flex-col items-center">
            <span
              className="text-2xl md:text-3xl font-bold tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700, #C4A572, #FFD700)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'golden-text 3s ease infinite',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                textShadow: isHovered ? '0 0 20px rgba(255,215,0,0.5)' : 'none'
              }}
            >
              {buttonText[language as keyof typeof buttonText]}
            </span>

            {/* Luxury tagline */}
            <span className="text-sm text-[#FFD700] tracking-[0.4em] uppercase mt-2 font-light">
              Premium Experience
            </span>
          </div>

          {/* Right phone icon */}
          <motion.div
            animate={{
              rotate: isHovered ? [0, 5, -5, 5, -5, 0] : 0,
              scale: isHovered ? 1.15 : 1
            }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <Phone className="w-8 h-8 text-[#FFD700] drop-shadow-[0_0_15px_rgba(255,215,0,0.7)]" />
          </motion.div>
        </div>

        {/* Live Notification Badge */}
        <motion.div
          className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1 shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 10
          }}
        >
          <motion.div
            className="w-2 h-2 bg-white rounded-full"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          LIVE
        </motion.div>

        {/* Animated pulse rings - golden */}
        <div className="absolute inset-0 rounded-2xl border border-[#FFD700]/20 animate-ping-slow" />
        <div className="absolute inset-0 rounded-2xl border border-[#C4A572]/10 animate-ping-slower" />

        {/* Corner accents - luxury detail */}
        <div className="absolute top-0 left-0 w-6 h-6">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent" />
          <div className="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-[#FFD700] to-transparent" />
        </div>
        <div className="absolute top-0 right-0 w-6 h-6">
          <div className="absolute top-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#FFD700] to-transparent" />
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-[#FFD700] to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 w-6 h-6">
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#FFD700] to-transparent" />
          <div className="absolute bottom-0 left-0 h-full w-[2px] bg-gradient-to-t from-[#FFD700] to-transparent" />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6">
          <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-[#FFD700] to-transparent" />
          <div className="absolute bottom-0 right-0 h-full w-[2px] bg-gradient-to-t from-[#FFD700] to-transparent" />
        </div>
      </motion.button>

      {/* Bottom reflection glow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-[#FFD700]/10 blur-2xl group-hover:bg-[#FFD700]/20 transition-colors duration-500" />

      <style>{`
        @keyframes golden-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes golden-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .animate-ping-slow {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-slower {
          animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}