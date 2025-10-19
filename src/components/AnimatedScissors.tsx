import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AnimatedScissorsProps {
  onDateTimeSelect: (date: string, time: string) => void;
}

export default function AnimatedScissors({ onDateTimeSelect }: AnimatedScissorsProps) {
  const [isOpen, setIsOpen] = useState(false);
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
  const times = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onDateTimeSelect(selectedDate, selectedTime);
      setIsOpen(false);
    }
  };

  const texts = {
    ar: {
      selectDate: 'اختر التاريخ',
      selectTime: 'اختر الوقت',
      confirm: 'تأكيد الموعد',
      clickScissors: 'اضغط على المقص'
    },
    en: {
      selectDate: 'Select Date',
      selectTime: 'Select Time',
      confirm: 'Confirm Appointment',
      clickScissors: 'Click the Scissors'
    },
    he: {
      selectDate: 'בחר תאריך',
      selectTime: 'בחר שעה',
      confirm: 'אשר תור',
      clickScissors: 'לחץ על המספריים'
    }
  };

  const t = texts[language as keyof typeof texts] || texts.en;

  return (
    <div className="relative">
      {/* Scissors Button */}
      <motion.div
        className="relative cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-[#FFD700]/40 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Premium Scissors SVG - High Definition */}
        <motion.svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          className="drop-shadow-2xl"
          animate={{
            rotate: isOpen ? 45 : 0,
          }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <defs>
            {/* Gold gradient */}
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#FFA500" />
              <stop offset="100%" stopColor="#C4A572" />
            </linearGradient>

            {/* Chrome effect gradient */}
            <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#C4A572" />
            </linearGradient>

            {/* Shadow filter */}
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
            </filter>

            {/* Shine effect */}
            <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.7" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Left scissors blade */}
          <motion.g
            animate={{
              rotate: isOpen ? -30 : 0,
            }}
            style={{ transformOrigin: '100px 100px' }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            {/* Blade */}
            <path
              d="M 100 100 L 40 30 Q 35 25 30 30 L 25 35 Q 20 40 25 45 L 95 105 Z"
              fill="url(#chromeGradient)"
              stroke="#C4A572"
              strokeWidth="2"
              filter="url(#shadow)"
            />
            {/* Handle */}
            <circle
              cx="50"
              cy="40"
              r="15"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="4"
            />
            {/* Screw */}
            <circle cx="100" cy="100" r="8" fill="#FFD700" stroke="#C4A572" strokeWidth="1" />

            {/* Blade shine effect */}
            <path
              d="M 100 100 L 40 30 Q 35 25 30 30 L 25 35 Q 20 40 25 45 L 95 105 Z"
              fill="url(#shine)"
              opacity="0.3"
            />
          </motion.g>

          {/* Right scissors blade */}
          <motion.g
            animate={{
              rotate: isOpen ? 30 : 0,
            }}
            style={{ transformOrigin: '100px 100px' }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          >
            {/* Blade */}
            <path
              d="M 100 100 L 160 30 Q 165 25 170 30 L 175 35 Q 180 40 175 45 L 105 105 Z"
              fill="url(#chromeGradient)"
              stroke="#C4A572"
              strokeWidth="2"
              filter="url(#shadow)"
            />
            {/* Handle */}
            <circle
              cx="150"
              cy="40"
              r="15"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="4"
            />

            {/* Blade shine effect */}
            <path
              d="M 100 100 L 160 30 Q 165 25 170 30 L 175 35 Q 180 40 175 45 L 105 105 Z"
              fill="url(#shine)"
              opacity="0.3"
            />
          </motion.g>

          {/* Center decoration */}
          <motion.circle
            cx="100"
            cy="100"
            r="5"
            fill="#FFD700"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Sparkles */}
          {[...Array(5)].map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + Math.cos((i * 72 * Math.PI) / 180) * 30}
              cy={100 + Math.sin((i * 72 * Math.PI) / 180) * 30}
              r="2"
              fill="#FFD700"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.svg>

        {/* Instruction text */}
        {!isOpen && (
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[#FFD700] text-sm font-medium whitespace-nowrap"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="inline-block w-4 h-4 mr-1" />
            {t.clickScissors}
            <Sparkles className="inline-block w-4 h-4 ml-1" />
          </motion.div>
        )}
      </motion.div>

      {/* Date/Time Picker Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="absolute top-full mt-8 left-1/2 -translate-x-1/2 bg-black border-2 border-[#FFD700] rounded-2xl p-6 z-50 min-w-[400px] shadow-2xl"
            style={{
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
              background: 'linear-gradient(135deg, #000000, #1a1a1a)',
            }}
          >
            {/* Decorative top border */}
            <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent" />

            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="text-[#FFD700] text-lg font-bold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {t.selectDate}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((date, index) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const isToday = index === 0;
                  const dayName = date.toLocaleDateString(
                    language === 'ar' ? 'ar-SA' : language === 'he' ? 'he-IL' : 'en-US',
                    { weekday: 'short' }
                  );
                  const dayNum = date.getDate();

                  return (
                    <motion.button
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedDate === dateStr
                          ? 'bg-gradient-to-r from-[#FFD700] to-[#C4A572] border-[#FFD700] text-black'
                          : 'border-[#FFD700]/30 hover:border-[#FFD700] text-white hover:bg-[#FFD700]/10'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-xs">{dayName}</div>
                      <div className="text-lg font-bold">{dayNum}</div>
                      {isToday && (
                        <div className="text-xs text-[#FFD700]">Today</div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-6">
              <h3 className="text-[#FFD700] text-lg font-bold mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {t.selectTime}
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {times.map((time) => (
                  <motion.button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      selectedTime === time
                        ? 'bg-gradient-to-r from-[#FFD700] to-[#C4A572] border-[#FFD700] text-black'
                        : 'border-[#FFD700]/30 hover:border-[#FFD700] text-white hover:bg-[#FFD700]/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <motion.button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedDate && selectedTime
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black hover:from-[#C4A572] hover:to-[#FFD700]'
                  : 'bg-zinc-800 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={selectedDate && selectedTime ? { scale: 1.02 } : {}}
              whileTap={selectedDate && selectedTime ? { scale: 0.98 } : {}}
            >
              {t.confirm}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}