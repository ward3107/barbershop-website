import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfessionalBookingButtonProps {
  onClick: () => void;
}

export default function ProfessionalBookingButton({ onClick }: ProfessionalBookingButtonProps) {
  const [showQuickBooking, setShowQuickBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const { language } = useLanguage();

  // Generate next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = generateDates();
  const morningTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
  const afternoonTimes = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const eveningTimes = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];

  const texts = {
    ar: {
      bookNow: 'احجز موعدك',
      selectDate: 'اختر التاريخ',
      selectTime: 'اختر الوقت',
      morning: 'صباحاً',
      afternoon: 'بعد الظهر',
      evening: 'مساءً',
      continue: 'متابعة',
      today: 'اليوم',
      tomorrow: 'غداً',
      quickBook: 'حجز سريع'
    },
    en: {
      bookNow: 'Book Appointment',
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening',
      continue: 'Continue',
      today: 'Today',
      tomorrow: 'Tomorrow',
      quickBook: 'Quick Book'
    },
    he: {
      bookNow: 'הזמן תור',
      selectDate: 'בחר תאריך',
      selectTime: 'בחר שעה',
      morning: 'בוקר',
      afternoon: 'צהריים',
      evening: 'ערב',
      continue: 'המשך',
      today: 'היום',
      tomorrow: 'מחר',
      quickBook: 'הזמנה מהירה'
    }
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      // Store the selection for the main modal
      localStorage.setItem('preSelectedDate', selectedDate);
      localStorage.setItem('preSelectedTime', selectedTime);
      setShowQuickBooking(false);
      onClick(); // Open main appointment modal
    }
  };

  const formatDate = (date: Date, index: number) => {
    if (index === 0) return t.today;
    if (index === 1) return t.tomorrow;

    return date.toLocaleDateString(
      language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
      { weekday: 'short', month: 'short', day: 'numeric' }
    );
  };

  return (
    <>
      {/* Main Button - Professional & Elegant */}
      <motion.button
        className="relative group overflow-hidden"
        onClick={() => setShowQuickBooking(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Elegant gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-zinc-900 rounded-2xl" />

        {/* Golden accent border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-[#FFD700]" />

        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 px-12 py-5 flex items-center gap-4">
          <Calendar className="w-6 h-6 text-[#FFD700]" />
          <span className="text-xl font-semibold text-white tracking-wide">
            {t.bookNow}
          </span>
          <ChevronRight className="w-5 h-5 text-[#FFD700] group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Professional badge */}
        <div className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-xs px-2 py-1 rounded-full font-bold">
          24/7
        </div>
      </motion.button>

      {/* Quick Booking Overlay - Professional Design */}
      <AnimatePresence>
        {showQuickBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-start justify-center p-4 pt-20"
            onClick={() => setShowQuickBooking(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-zinc-900 to-black border border-[#FFD700]/30 rounded-3xl p-8 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#FFD700] mb-2">{t.quickBook}</h2>
                <p className="text-gray-400">SHOKHA BARBERSHOP</p>
              </div>

              {/* Date Selection */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-[#FFD700] mr-2" />
                  {t.selectDate}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date, index) => {
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <motion.button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedDate === dateStr
                            ? 'bg-[#FFD700] border-[#FFD700] text-black'
                            : 'bg-zinc-900 border-zinc-700 text-white hover:border-[#FFD700]/50'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-xs opacity-70 mb-1">
                          {formatDate(date, index).split(',')[0]}
                        </div>
                        <div className="text-lg font-bold">{date.getDate()}</div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 text-[#FFD700] mr-2" />
                    {t.selectTime}
                  </h3>

                  {/* Morning Times */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">{t.morning}</p>
                    <div className="grid grid-cols-6 gap-2">
                      {morningTimes.map((time) => (
                        <motion.button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-lg border transition-all ${
                            selectedTime === time
                              ? 'bg-[#FFD700] border-[#FFD700] text-black'
                              : 'bg-zinc-900 border-zinc-700 text-white hover:border-[#FFD700]/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Afternoon Times */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">{t.afternoon}</p>
                    <div className="grid grid-cols-6 gap-2">
                      {afternoonTimes.map((time) => (
                        <motion.button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-lg border transition-all ${
                            selectedTime === time
                              ? 'bg-[#FFD700] border-[#FFD700] text-black'
                              : 'bg-zinc-900 border-zinc-700 text-white hover:border-[#FFD700]/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Evening Times */}
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">{t.evening}</p>
                    <div className="grid grid-cols-6 gap-2">
                      {eveningTimes.map((time) => (
                        <motion.button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-lg border transition-all ${
                            selectedTime === time
                              ? 'bg-[#FFD700] border-[#FFD700] text-black'
                              : 'bg-zinc-900 border-zinc-700 text-white hover:border-[#FFD700]/50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {time}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Continue Button */}
              {selectedDate && selectedTime && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center"
                >
                  <motion.button
                    onClick={handleContinue}
                    className="px-12 py-4 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold text-lg rounded-xl hover:from-[#C4A572] hover:to-[#FFD700] transition-all flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Check className="w-5 h-5" />
                    {t.continue}
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Selected Summary */}
              {selectedDate && selectedTime && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-center text-gray-400"
                >
                  <p>
                    {new Date(selectedDate).toLocaleDateString(
                      language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
                      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                    )} - {selectedTime}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}