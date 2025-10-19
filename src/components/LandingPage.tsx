import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from './Navigation';
import AppointmentModal from './AppointmentModal';
import HomeSection from './HomeSection';
import GallerySection from './GallerySection';
import ScrollToTop from './ScrollToTop';
import CookieConsent from './CookieConsent';
import AccessibilityMenu from './AccessibilityMenu';
import LuxuryAnnouncementBar from './LuxuryAnnouncementBar';
import GalacticAppointmentButton from './GalacticAppointmentButton';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LandingPage() {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const { } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden bg-black">
        {/* Lion with Barber Chair Background */}
        <div className="absolute inset-0">
          {/* Base black */}
          <div className="absolute inset-0 bg-black" />

          {/* Lion and barber chair VIVID FOCUSED background */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'sepia(80%) saturate(250%) hue-rotate(10deg) brightness(1.1) contrast(1.5)',
            }}
          />

          {/* Focused gradient overlays - less darkening for more vivid look */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(255, 215, 0, 0.1) 100px,
                rgba(255, 215, 0, 0.1) 101px
              )`
            }}
          />

          {/* Vignette effect */}
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
            }}
          />

          {/* Floating golden particles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#FFD700]/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                boxShadow: '0 0 6px rgba(255, 215, 0, 0.3)',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <Navigation />

          <main className="container mx-auto px-4 pt-32 pb-16 min-h-screen flex items-center justify-center">
            <div className="max-w-6xl w-full flex flex-col items-center text-center px-2">
              {/* Shop Name - Two Words with Individual Vivid Backgrounds */}
              <div className="relative mb-8 w-full flex flex-col items-center gap-2 md:gap-4">

                {/* SHOKHA - First Word */}
                <div className="relative inline-block">
                  {/* Vivid Animated Background for SHOKHA */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 -m-4 sm:-m-6 md:-m-8 lg:-m-10 hidden md:block"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(196,165,114,0.2) 25%, rgba(255,140,0,0.2) 50%, rgba(255,215,0,0.2) 75%, rgba(196,165,114,0.2) 100%)',
                      backgroundSize: '400% 400%',
                      animation: 'gradient-shift 8s ease infinite',
                      filter: 'blur(35px)',
                      borderRadius: '50%',
                      transform: 'scale(1.3)',
                      willChange: 'transform, opacity',
                    }}
                  />

                  {/* Simpler background for mobile - no animation */}
                  <div
                    className="absolute inset-0 -m-4 md:hidden"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 50%, transparent 80%)',
                      filter: 'blur(20px)',
                      borderRadius: '50%',
                    }}
                  />

                  {/* Golden Glow Layer for SHOKHA - Desktop only */}
                  <motion.div
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 -m-3 sm:-m-5 md:-m-7 hidden md:block"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.15) 40%, transparent 70%)',
                      filter: 'blur(25px)',
                      willChange: 'transform, opacity',
                    }}
                  />

                  {/* SHOKHA Text */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative text-[#FFD700] text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[0.15em] uppercase px-3 py-1"
                    style={{
                      textShadow: '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3), 0 0 100px rgba(255,215,0,0.2)',
                      direction: 'ltr',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {'SHOKHA'.split('').map((letter, index) => (
                      <motion.span
                        key={`shokha-${index}`}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{
                          opacity: 1,
                          y: [100, -20, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.05,
                          type: 'spring',
                          stiffness: 120,
                          damping: 10
                        }}
                        style={{
                          display: 'inline-block',
                          animation: `wave 2s ease-in-out ${index * 0.05}s infinite`
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>

                {/* BARBERSHOP - Second Word (Never breaks) */}
                <div className="relative inline-block">
                  {/* Vivid Animated Background for BARBERSHOP - Desktop only */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute inset-0 -m-4 sm:-m-6 md:-m-8 lg:-m-10 hidden md:block"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(196,165,114,0.2) 25%, rgba(255,140,0,0.2) 50%, rgba(255,215,0,0.2) 75%, rgba(196,165,114,0.2) 100%)',
                      backgroundSize: '400% 400%',
                      animation: 'gradient-shift 8s ease infinite 0.5s',
                      filter: 'blur(35px)',
                      borderRadius: '50%',
                      transform: 'scale(1.3)',
                      willChange: 'transform, opacity',
                    }}
                  />

                  {/* Simpler background for mobile - no animation */}
                  <div
                    className="absolute inset-0 -m-4 md:hidden"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0.1) 50%, transparent 80%)',
                      filter: 'blur(20px)',
                      borderRadius: '50%',
                    }}
                  />

                  {/* Golden Glow Layer for BARBERSHOP - Desktop only */}
                  <motion.div
                    animate={{
                      opacity: [0.4, 0.7, 0.4],
                      scale: [1, 1.15, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute inset-0 -m-3 sm:-m-5 md:-m-7 hidden md:block"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.4) 0%, rgba(255,215,0,0.15) 40%, transparent 70%)',
                      filter: 'blur(25px)',
                      willChange: 'transform, opacity',
                    }}
                  />

                  {/* BARBERSHOP Text - NEVER BREAKS */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="relative text-[#FFD700] text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[0.15em] uppercase px-3 py-1"
                    style={{
                      textShadow: '0 0 30px rgba(255,215,0,0.6), 0 0 60px rgba(255,215,0,0.3), 0 0 100px rgba(255,215,0,0.2)',
                      direction: 'ltr',
                      whiteSpace: 'nowrap', // Prevents word from breaking
                      overflow: 'visible',
                    }}
                  >
                    {'BARBERSHOP'.split('').map((letter, index) => (
                      <motion.span
                        key={`barbershop-${index}`}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{
                          opacity: 1,
                          y: [100, -20, 0],
                        }}
                        transition={{
                          duration: 0.5,
                          delay: 0.3 + (index * 0.05),
                          type: 'spring',
                          stiffness: 120,
                          damping: 10
                        }}
                        style={{
                          display: 'inline-block',
                          animation: `wave 2s ease-in-out ${0.3 + (index * 0.05)}s infinite`
                        }}
                      >
                        {letter}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </div>


              {/* CTA Button - Galactic Edition */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <GalacticAppointmentButton onClick={() => setAppointmentOpen(true)} />
              </motion.div>

              {/* Luxury Announcement Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-20"
              >
                <LuxuryAnnouncementBar />
              </motion.div>
            </div>
          </main>
        </div>
      </div>

      {/* Additional Sections */}
      <HomeSection />
      <GallerySection />

      <AppointmentModal open={appointmentOpen} onOpenChange={setAppointmentOpen} />
      <ScrollToTop />
      <CookieConsent />
      <AccessibilityMenu />

      {/* Hidden Admin Access - Small link in bottom right */}
      <a
        href="#admin"
        className="fixed bottom-4 right-4 text-[10px] text-gray-700 hover:text-[#FFD700] transition-colors opacity-30 hover:opacity-100 z-30"
        title="Admin Access"
      >
        Admin
      </a>

      {/* Animations for vivid background */}
      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}