import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface Announcement {
  id: string;
  textAr: string;
  textEn: string;
  textHe: string;
}

// Live news feed - Owner can update this array with new announcements
const announcements: Announcement[] = [
  {
    id: '1',
    textAr: '🔥 عرض اليوم: خصم 25% على جميع الخدمات!',
    textEn: '🔥 Today\'s Deal: 25% off all services!',
    textHe: '🔥 מבצע היום: 25% הנחה על כל השירותים!',
  },
  {
    id: '2',
    textAr: '⭐ تقييم 5 نجوم من أكثر من 500 عميل!',
    textEn: '⭐ 5-star rating from 500+ customers!',
    textHe: '⭐ דירוג 5 כוכבים מיותר מ-500 לקוחות!',
  },
  {
    id: '3',
    textAr: '🎯 احجز الآن واحصل على تشذيب لحية مجاني!',
    textEn: '🎯 Book now and get a free beard trim!',
    textHe: '🎯 הזמן עכשיו וקבל עיצוב זקן חינם!',
  },
  {
    id: '4',
    textAr: '⏰ متاح الآن: مواعيد مسائية حتى 9 مساءً',
    textEn: '⏰ Now available: Evening slots until 9 PM',
    textHe: '⏰ זמין עכשיו: תורים ערב עד 21:00',
  },
  {
    id: '5',
    textAr: '🏆 أفضل صالون حلاقة في فيستا 2024',
    textEn: '🏆 Best Barbershop in Vista 2024',
    textHe: '🏆 המספרה הטובה ביותר בויסטה 2024',
  },
  {
    id: '6',
    textAr: '💈 خبرة 20 عاماً في خدمتكم',
    textEn: '💈 20 years of experience serving you',
    textHe: '💈 20 שנות ניסיון בשירותכם',
  },
  {
    id: '7',
    textAr: '🎁 برنامج ولاء: قص مجاني بعد 10 زيارات',
    textEn: '🎁 Loyalty program: Free cut after 10 visits',
    textHe: '🎁 תוכנית נאמנות: תספורת חינם אחרי 10 ביקורים',
  },
  {
    id: '8',
    textAr: '📱 احجز عبر الإنترنت واحصل على خصم 10%',
    textEn: '📱 Book online and get 10% discount',
    textHe: '📱 הזמן אונליין וקבל 10% הנחה',
  },
  {
    id: '9',
    textAr: '👨‍👦 عرض العائلة: خصم 30% للأب والابن',
    textEn: '👨‍👦 Family special: 30% off father & son',
    textHe: '👨‍👦 מבצע משפחה: 30% הנחה לאב ובן',
  },
  {
    id: '10',
    textAr: '🌟 منتجات عناية احترافية متوفرة الآن',
    textEn: '🌟 Professional care products now available',
    textHe: '🌟 מוצרי טיפוח מקצועיים זמינים עכשיו',
  },
];

export default function AnnouncementBadge() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { language } = useLanguage();

  // Auto-rotate announcements every 3 seconds
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      handleNext();
    } else if (e.deltaY < 0) {
      handlePrev();
    }
  };

  const currentAnnouncement = announcements[currentIndex];
  const displayText =
    language === 'ar'
      ? currentAnnouncement.textAr
      : language === 'he'
      ? currentAnnouncement.textHe
      : currentAnnouncement.textEn;

  return (
    <div
      className="relative w-full max-w-4xl h-20 md:h-24 cursor-pointer"
      onWheel={handleWheel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg bg-[#C4A572]/10 blur-md" />

      <div className="relative border border-[#C4A572] rounded-lg bg-gradient-to-r from-black via-zinc-900 to-black flex items-center justify-between px-6 md:px-8 py-3 md:py-4 shadow-xl overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, #C4A572 35px, #C4A572 70px)'
          }} />
        </div>

        {/* Left side - Logo/Brand */}
        <div className="flex items-center gap-3 z-10">
          <div className="hidden md:block">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-[#C4A572] flex items-center justify-center bg-black/50">
              <span className="text-base lg:text-lg font-bold text-[#C4A572]">SH</span>
            </div>
          </div>
          <div>
            <p className="text-white text-sm md:text-base font-bold">
              SHOKHA BARBER SHOP
            </p>
            <p className="text-[#C4A572] text-xs hidden md:block">
              {language === 'ar' ? 'أفضل محترف في المدينة' : language === 'he' ? 'המקצוען הטוב ביותר בעיר' : 'BestProInTown'}
            </p>
          </div>
        </div>

        {/* Center - Animated announcement text */}
        <div className="flex-1 mx-4 md:mx-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, type: 'spring' }}
              className="text-center"
            >
              <p className="text-[#C4A572] text-sm md:text-base font-bold tracking-wide">
                {displayText}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side - Live indicator & controls */}
        <div className="flex items-center gap-3 z-10">
          <div className="hidden lg:flex items-center gap-2 px-2 py-1 bg-red-500/20 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-xs text-red-500 font-bold uppercase">LIVE</span>
          </div>

          {/* Navigation arrows */}
          <div className="flex gap-1">
            <button
              onClick={handlePrev}
              className="w-7 h-7 rounded-full bg-[#C4A572]/20 hover:bg-[#C4A572]/30 flex items-center justify-center transition-colors"
              aria-label="Previous announcement"
            >
              <span className="text-[#C4A572] text-sm">‹</span>
            </button>
            <button
              onClick={handleNext}
              className="w-7 h-7 rounded-full bg-[#C4A572]/20 hover:bg-[#C4A572]/30 flex items-center justify-center transition-colors"
              aria-label="Next announcement"
            >
              <span className="text-[#C4A572] text-sm">›</span>
            </button>
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#C4A572] rounded-tl-lg opacity-50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#C4A572] rounded-br-lg opacity-50" />
      </div>

      {/* Indicator Dots - positioned below */}
      <div className="flex justify-center gap-1 mt-2">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 5000); // Resume after 5 seconds
            }}
            className={`h-1 rounded-full transition-all ${
              index === currentIndex ? 'bg-[#C4A572] w-6' : 'bg-gray-600 hover:bg-gray-500 w-1'
            }`}
            aria-label={`Go to announcement ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}