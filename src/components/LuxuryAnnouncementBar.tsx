import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Crown, Diamond, Star, Award, Gift } from 'lucide-react';

interface Announcement {
  id: string;
  textAr: string;
  textEn: string;
  textHe: string;
  icon: React.ReactNode;
  type: 'hot' | 'exclusive' | 'limited' | 'vip';
}

const announcements: Announcement[] = [
  {
    id: '1',
    textAr: 'عرض VIP حصري: خصم 40% للعملاء المميزين',
    textEn: 'VIP Exclusive: 40% off for Premium Members',
    textHe: 'VIP בלעדי: 40% הנחה לחברי פרימיום',
    icon: <Crown className="w-4 h-4" />,
    type: 'vip'
  },
  {
    id: '2',
    textAr: 'تصنيف 5 نجوم ذهبية من 1000+ عميل راضٍ',
    textEn: '5 Golden Stars from 1000+ Satisfied Clients',
    textHe: '5 כוכבי זהב מ-1000+ לקוחות מרוצים',
    icon: <Star className="w-4 h-4" />,
    type: 'hot'
  },
  {
    id: '3',
    textAr: 'احجز اليوم: تجربة حلاقة احترافية مع خدمات مجانية',
    textEn: 'Book Today: Professional Grooming with Complimentary Services',
    textHe: 'הזמן היום: טיפוח מקצועי עם שירותים חינם',
    icon: <Diamond className="w-4 h-4" />,
    type: 'exclusive'
  },
  {
    id: '4',
    textAr: 'عرض محدود: باقة العناية الفاخرة بسعر خاص',
    textEn: 'Limited Offer: Luxury Care Package at Special Price',
    textHe: 'הצעה מוגבלת: חבילת טיפוח יוקרתית במחיר מיוחד',
    icon: <Gift className="w-4 h-4" />,
    type: 'limited'
  },
  {
    id: '5',
    textAr: 'الحائز على جائزة أفضل صالون حلاقة فاخر 2024',
    textEn: 'Award-Winning Luxury Barbershop of 2024',
    textHe: 'זוכה פרס מספרת היוקרה של 2024',
    icon: <Award className="w-4 h-4" />,
    type: 'vip'
  }
];

export default function LuxuryAnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const { language } = useLanguage();

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const currentAnnouncement = announcements[currentIndex];
  const displayText =
    language === 'ar'
      ? currentAnnouncement.textAr
      : language === 'he'
      ? currentAnnouncement.textHe
      : currentAnnouncement.textEn;

  const typeColors = {
    hot: 'from-red-600 to-orange-500',
    exclusive: 'from-purple-600 to-pink-500',
    limited: 'from-blue-600 to-cyan-500',
    vip: 'from-[#FFD700] to-[#C4A572]'
  };

  return (
    <div
      className="relative w-full max-w-5xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Luxury golden glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-[#FFD700]/10 via-[#C4A572]/5 to-[#FFD700]/10 rounded-3xl blur-xl" />

      {/* Main container with black mirror finish */}
      <div className="relative bg-black rounded-2xl overflow-hidden border border-[#FFD700]/30">

        {/* Golden gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/10 via-transparent to-[#FFD700]/10" />

        {/* Animated shimmer effect */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(90deg,
              transparent 0%,
              rgba(255, 215, 0, 0.3) 45%,
              rgba(255, 215, 0, 0.5) 50%,
              rgba(255, 215, 0, 0.3) 55%,
              transparent 100%
            )`,
            transform: `translateX(${-100 + (mousePosition.x * 2)}%)`,
            transition: 'transform 0.5s ease-out'
          }}
        />

        {/* Mirror reflection based on mouse */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(255, 215, 0, 0.15) 0%,
              transparent 40%
            )`
          }}
        />

        <div className="relative flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-8 py-4 md:py-6 gap-3 md:gap-0">

          {/* Left side - Luxury branding */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#FFD700] to-[#C4A572] p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <Crown className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                </div>
              </div>
              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full bg-[#FFD700]/20 animate-ping pointer-events-none" />
            </div>

            <div className="hidden sm:block">
              <p className="text-[#FFD700] text-xs md:text-sm font-bold tracking-wider">
                SHOKHA
              </p>
              <p className="text-[#C4A572] text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase">
                Barber Shop
              </p>
            </div>
          </div>

          {/* Center - Animated announcement */}
          <div className="flex-1 w-full md:mx-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3"
              >
                {/* Type indicator badge */}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${typeColors[currentAnnouncement.type]}`}>
                  {currentAnnouncement.icon}
                  <span className="text-white text-xs font-bold uppercase">
                    {currentAnnouncement.type}
                  </span>
                </div>

                {/* Announcement text with golden gradient */}
                <p className="text-center text-sm sm:text-base font-semibold tracking-wide px-2"
                  style={{
                    background: 'linear-gradient(90deg, #FFD700, #FFA500, #FFD700)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'golden-text 3s linear infinite'
                  }}
                >
                  {displayText}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side - Status indicators */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-red-500/20 rounded-full border border-red-500/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs text-red-500 font-bold">LIVE</span>
            </div>

            {/* Navigation dots */}
            <div className="flex gap-1">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-[#FFD700] w-4 md:w-6'
                      : 'bg-[#C4A572]/50 hover:bg-[#C4A572]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Premium corner accents */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d="M0,0 L30,0 Q0,0 0,30 Z"
              fill="url(#gold-gradient)"
              opacity="0.3"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path
              d="M0,0 L30,0 Q0,0 0,30 Z"
              fill="url(#gold-gradient)"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* SVG gradient definition */}
        <svg className="absolute" width="0" height="0">
          <defs>
            <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#C4A572" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom reflection */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 bg-[#FFD700]/5 blur-2xl" />

      <style>{`
        @keyframes golden-text {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </div>
  );
}