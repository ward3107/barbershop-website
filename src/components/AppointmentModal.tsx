import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EnhancedCalendar from './EnhancedCalendar';
import {
  Scissors, Crown, Clock, Calendar as CalendarIcon,
  Sparkles, ChevronRight, Check, User, Phone, Mail, AlertCircle, XCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './Toast';
import { createBooking } from './BookingSystem';
import { sendBookingToMake } from '@/services/makeWebhook';

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'
];

const services = [
  {
    id: 'beard',
    nameEn: 'Beard Trim',
    nameAr: 'تشذيب الذقن',
    nameHe: 'גילוח זקן',
    descEn: 'Professional beard trimming and shaping',
    descAr: 'تشذيب وتشكيل احترافي للذقن',
    descHe: 'גילוח ועיצוב זקן מקצועי',
    price: '₪20',
    duration: '20 min',
    icon: <Scissors className="w-5 h-5" />
  },
  {
    id: 'haircut-beard',
    nameEn: 'Hair Cut + Beard Trim',
    nameAr: 'قص الشعر والذقن',
    nameHe: 'תספורת וגילוח זקן',
    descEn: 'Complete grooming - hair and beard',
    descAr: 'عناية كاملة - قص الشعر والذقن',
    descHe: 'טיפול מלא - תספורת וזקן',
    price: '₪50',
    duration: '40 min',
    popular: true,
    icon: <Crown className="w-5 h-5" />
  }
];

export default function AppointmentModal({ open, onOpenChange }: AppointmentModalProps) {
  const [step, setStep] = useState<'service' | 'datetime' | 'contact'>('service');
  const [selectedService, setSelectedService] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [recurringCount, setRecurringCount] = useState(4);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const { t, language } = useLanguage();
  const { currentUser, userProfile } = useAuth();
  const toast = useToast();

  // Handle browser back button
  useEffect(() => {
    if (open) {
      // Push a new state when modal opens
      window.history.pushState({ modal: 'appointment' }, '');

      const handlePopState = () => {
        onOpenChange(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [open, onOpenChange]);

  // Load customer info from logged-in user or localStorage when modal opens
  useEffect(() => {
    if (open) {
      // If user is logged in, use their profile information
      if (currentUser && userProfile) {
        setCustomerName(userProfile.displayName || '');
        setCustomerEmail(userProfile.email || currentUser.email || '');
        setCustomerPhone(userProfile.phone || '');
      } else {
        // Otherwise, try to load from localStorage (for guest users)
        const savedInfo = localStorage.getItem('shokha_customer_info');
        if (savedInfo) {
          try {
            const { name, phone, email } = JSON.parse(savedInfo);
            setCustomerName(name || '');
            setCustomerPhone(phone || '');
            setCustomerEmail(email || '');
          } catch (error) {
            console.error('Error loading saved customer info:', error);
          }
        }
      }
    }
  }, [open, currentUser, userProfile]);

  // Load booked time slots for the selected date
  useEffect(() => {
    if (date) {
      const stored = localStorage.getItem('shokha_bookings');
      if (stored) {
        try {
          const bookings = JSON.parse(stored);
          const selectedDateStr = date.toDateString();

          // Find all bookings for the selected date that are not rejected
          const bookedTimes = bookings
            .filter((booking: any) => {
              const bookingDate = new Date(booking.date);
              return bookingDate.toDateString() === selectedDateStr &&
                     booking.status !== 'rejected';
            })
            .map((booking: any) => booking.time);

          setBookedSlots(bookedTimes);
        } catch (error) {
          console.error('Error loading booked slots:', error);
        }
      } else {
        setBookedSlots([]);
      }
    }
  }, [date]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep('datetime');
  };

  const handleDateTimeNext = () => {
    if (date && selectedTime) {
      setStep('contact');
    }
  };

  const generateRecurringDates = (startDate: Date, type: 'weekly' | 'biweekly' | 'monthly', count: number): Date[] => {
    const dates = [new Date(startDate)];

    for (let i = 1; i < count; i++) {
      const newDate = new Date(dates[dates.length - 1]);

      if (type === 'weekly') {
        newDate.setDate(newDate.getDate() + 7);
      } else if (type === 'biweekly') {
        newDate.setDate(newDate.getDate() + 14);
      } else if (type === 'monthly') {
        newDate.setMonth(newDate.getMonth() + 1);
      }

      dates.push(newDate);
    }

    return dates;
  };

  const validatePhone = (phone: string): boolean => {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check if it contains only digits and optional + at the start
    const phoneRegex = /^\+?[0-9]{9,15}$/;

    if (!phoneRegex.test(cleaned)) {
      setPhoneError(
        language === 'ar'
          ? 'رقم الهاتف يجب أن يحتوي على 9-15 رقم'
          : language === 'he'
          ? 'מספר הטלפון צריך להכיל 9-15 ספרות'
          : 'Phone number must contain 9-15 digits'
      );
      return false;
    }

    setPhoneError('');
    return true;
  };

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('');
      return true; // Email is optional
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError(
        language === 'ar'
          ? 'البريد الإلكتروني غير صالح'
          : language === 'he'
          ? 'כתובת דואר אלקטרוני לא חוקית'
          : 'Invalid email address'
      );
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleBooking = async () => {
    if (date && selectedTime && selectedService && customerName && customerPhone) {
      // Validate phone and email before submitting
      const isPhoneValid = validatePhone(customerPhone);
      const isEmailValid = validateEmail(customerEmail);

      if (!isPhoneValid || !isEmailValid) {
        return; // Stop if validation fails
      }

      const service = services.find(s => s.id === selectedService);
      const serviceName = language === 'ar' ? service?.nameAr : language === 'he' ? service?.nameHe : service?.nameEn;

      setIsSubmitting(true);
      try {
        // Get dates for recurring appointments
        const dates = isRecurring
          ? generateRecurringDates(date, recurringType, recurringCount)
          : [date];

        // Create all bookings
        const bookings = [];
        for (const bookingDate of dates) {
          const booking = await createBooking(
            customerName,
            customerPhone,
            serviceName || '',
            bookingDate,
            selectedTime,
            customerEmail
          );
          bookings.push(booking);
        }

        // Save customer info for next time
        localStorage.setItem('shokha_customer_info', JSON.stringify({
          name: customerName,
          phone: customerPhone,
          email: customerEmail
        }));

        // Send to Make.com for automatic WhatsApp (FREE option)
        console.log('📱 Sending booking to Make.com...');
        for (const booking of bookings) {
          await sendBookingToMake(booking);
        }

        // OR use Twilio (paid option - uncomment if using Twilio)
        // await notifyOwnerNewBooking(booking);

        // Show confirmation message
        const confirmMessage = isRecurring
          ? (language === 'ar'
            ? `✅ تم إرسال ${recurringCount} مواعيد متكررة بنجاح!\n\nالخدمة: ${serviceName}\nالوقت: ${selectedTime}\nالبدء: ${date.toLocaleDateString()}\n\n⏳ في انتظار موافقة الصالون\nستصلك رسائل تأكيد عبر WhatsApp قريباً`
            : language === 'he'
            ? `✅ ${recurringCount} פגישות חוזרות נשלחו בהצלחה!\n\nשירות: ${serviceName}\nשעה: ${selectedTime}\nהתחלה: ${date.toLocaleDateString()}\n\n⏳ ממתין לאישור הספרייה\nתקבל הודעות אישור ב-WhatsApp בקרוב`
            : `✅ ${recurringCount} recurring appointments sent successfully!\n\nService: ${serviceName}\nTime: ${selectedTime}\nStarting: ${date.toLocaleDateString()}\n\n⏳ Waiting for salon approval\nYou will receive WhatsApp confirmations soon`)
          : (language === 'ar'
            ? `✅ تم إرسال طلب الحجز بنجاح!\n\nالخدمة: ${serviceName}\nالتاريخ: ${date.toLocaleDateString()}\nالوقت: ${selectedTime}\n\n⏳ في انتظار موافقة الصالون\nستصلك رسالة تأكيد عبر WhatsApp قريباً`
            : language === 'he'
            ? `✅ בקשת ההזמנה נשלחה בהצלחה!\n\nשירות: ${serviceName}\nתאריך: ${date.toLocaleDateString()}\nשעה: ${selectedTime}\n\n⏳ ממתין לאישור הספרייה\nתקבל הודעת אישור ב-WhatsApp בקרוב`
            : `✅ Booking request sent successfully!\n\nService: ${serviceName}\nDate: ${date.toLocaleDateString()}\nTime: ${selectedTime}\n\n⏳ Waiting for salon approval\nYou will receive a WhatsApp confirmation soon`);

        toast.success(confirmMessage, 6000);

        // Reset and close
        onOpenChange(false);
        setStep('service');
        setSelectedService('');
        setSelectedTime('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
      } catch (error) {
        console.error('Booking error:', error);
        toast.error(language === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : language === 'he' ? 'אירעה שגיאה. נסה שוב.' : 'An error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => {
        setStep('service');
        setSelectedService('');
        setSelectedTime('');
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-4xl w-[95vw] sm:w-full bg-black border-2 border-[#FFD700]/50 p-0 overflow-hidden max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onMouseMove={handleMouseMove}
      >
        {/* Golden gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 via-transparent to-[#FFD700]/5 pointer-events-none" />

        {/* Mirror reflection effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(255, 215, 0, 0.1) 0%,
              transparent 50%
            )`
          }}
        />

        {/* Header with crown animation */}
        <div className="relative bg-gradient-to-r from-black via-[#1a1a1a] to-black border-b border-[#FFD700]/30 p-3 md:p-6 pb-4 md:pb-6">
          {/* Close button - visible on mobile */}
          <button
            onClick={() => handleClose(false)}
            title="Close"
            aria-label="Close"
            className="absolute top-3 right-3 md:hidden z-50 w-9 h-9 rounded-full bg-black/80 border border-[#FFD700]/50 flex items-center justify-center text-white hover:bg-[#FFD700] hover:text-black transition-all shadow-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
              >
                <Crown className="h-12 w-12 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xl sm:text-2xl md:text-3xl font-bold mt-8 px-2"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            SHOKHA Booking
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 md:p-8"
        >
          {step === 'service' ? (
            <>
              <h2 className="text-2xl font-bold text-[#FFD700] text-center mb-2">
                {t('selectService')}
              </h2>
              <p className="text-gray-400 text-center mb-8">
                {t('chooseService')}
              </p>

              <div className="grid gap-4 max-w-3xl mx-auto">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => handleServiceSelect(service.id)}
                      className="relative w-full group overflow-hidden rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {/* Black mirror base */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900 to-black" />

                      {/* Golden border gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-[#C4A572]/10 to-[#FFD700]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: 'linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.3) 50%, transparent 60%)',
                          animation: 'shimmer 1.5s infinite'
                        }}
                      />

                      {/* Content */}
                      <div className="relative px-3 sm:px-6 py-4 sm:py-5 border-2 border-[#FFD700]/30 group-hover:border-[#FFD700]/60 rounded-xl transition-all duration-300">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-start gap-2 sm:gap-4 flex-1 min-w-0">
                            {/* Icon container */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-[#FFD700]/20 to-[#C4A572]/20 flex items-center justify-center group-hover:from-[#FFD700]/30 group-hover:to-[#C4A572]/30 transition-all duration-300">
                              <span className="text-[#FFD700]">{service.icon}</span>
                            </div>

                            {/* Service details */}
                            <div className="text-left flex-1 min-w-0">
                              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                <h3 className="text-white font-bold text-sm sm:text-lg group-hover:text-[#FFD700] transition-colors duration-300">
                                  {language === 'ar' ? service.nameAr : language === 'he' ? service.nameHe : service.nameEn}
                                </h3>
                                {service.popular && (
                                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold">
                                    POPULAR
                                  </span>
                                )}
                                {'vip' in service && (service as any).vip && (
                                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black rounded-full font-bold">
                                    VIP
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                                {language === 'ar' ? service.descAr : language === 'he' ? service.descHe : service.descEn}
                              </p>
                              <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
                                <span className="flex items-center gap-1 text-[#C4A572] text-xs sm:text-sm">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                  {service.duration}
                                </span>
                                <span className="text-[#FFD700] font-bold text-base sm:text-lg">
                                  {service.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Arrow icon */}
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-[#FFD700] opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" />
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </>
          ) : step === 'datetime' ? (
            <>
              <h2 className="text-2xl font-bold text-[#FFD700] text-center mb-2">
                {t('bookAppointment')}
              </h2>
              <p className="text-gray-400 text-center mb-8">
                {t('chooseDateTime')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Calendar Section */}
                <div className="relative w-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#FFD700]/10 via-[#C4A572]/5 to-[#FFD700]/10 rounded-xl blur-xl" />
                  <div className="relative bg-black border-2 border-[#FFD700]/30 rounded-xl p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <CalendarIcon className="w-4 h-4 md:w-5 md:h-5 text-[#FFD700]" />
                      <h3 className="text-base md:text-lg font-semibold text-[#FFD700]">Select Date</h3>
                    </div>
                    <div className="w-full overflow-x-auto">
                      <EnhancedCalendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md bg-black text-white [&_.rdp-day_button:hover]:bg-[#FFD700]/20 [&_.rdp-day_button[aria-selected]]:bg-[#FFD700] [&_.rdp-day_button[aria-selected]]:text-black mx-auto"
                        disabled={(date) => date < new Date()}
                      />
                    </div>
                  </div>
                </div>

                {/* Time Slots Section */}
                <div className="relative w-full">
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#FFD700]/10 via-[#C4A572]/5 to-[#FFD700]/10 rounded-xl blur-xl" />
                  <div className="relative bg-black border-2 border-[#FFD700]/30 rounded-xl p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#FFD700]" />
                      <h3 className="text-base md:text-lg font-semibold text-[#FFD700]">{t('selectTime')}</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <button
                            key={time}
                            onClick={() => !isBooked && setSelectedTime(time)}
                            disabled={isBooked}
                            className={`
                              relative px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-colors duration-200
                              ${isBooked
                                ? 'bg-red-900/30 border border-red-500/50 text-red-400 cursor-not-allowed opacity-60'
                                : selectedTime === time
                                ? 'bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black'
                                : 'bg-zinc-900 border border-[#FFD700]/30 text-gray-300 hover:border-[#FFD700]/60 hover:text-[#FFD700]'
                              }
                            `}
                          >
                            {selectedTime === time && !isBooked && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}
                            {isBooked && (
                              <div className="absolute -top-1 -right-1">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                  <XCircle className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}
                            <span>{time}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recurring Appointments */}
              <div className="mt-8 max-w-3xl mx-auto">
                <div className="bg-zinc-900 border-2 border-[#FFD700]/30 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-[#FFD700] bg-black checked:bg-[#FFD700] checked:border-[#FFD700] cursor-pointer"
                      />
                      <span className="text-white font-semibold group-hover:text-[#FFD700] transition-colors">
                        {language === 'ar' ? 'مواعيد متكررة' : language === 'he' ? 'פגישות חוזרות' : 'Recurring Appointments'}
                      </span>
                    </label>
                  </div>

                  {isRecurring && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 mt-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Frequency */}
                        <div>
                          <label
                            htmlFor="recurringType"
                            className="block text-gray-400 text-sm mb-2"
                          >
                            {language === 'ar' ? 'التكرار' : language === 'he' ? 'תדירות' : 'Frequency'}
                          </label>
                          <select
                              id="recurringType"
                              aria-label={
                                language === 'ar'
                                  ? 'نوع التكرار'
                                  : language === 'he'
                                  ? 'סוג תדירות'
                                  : 'Frequency'
                              }
                              value={recurringType}
                              onChange={(e) => setRecurringType(e.target.value as any)}
                              className="w-full px-4 py-3 bg-black border border-[#C4A572] rounded-lg text-white focus:outline-none focus:border-[#FFD700]"
                            >
                            <option value="weekly">
                              {language === 'ar' ? 'أسبوعياً' : language === 'he' ? 'שבועי' : 'Weekly'}
                            </option>
                            <option value="biweekly">
                              {language === 'ar' ? 'كل أسبوعين' : language === 'he' ? 'דו-שבועי' : 'Every 2 Weeks'}
                            </option>
                            <option value="monthly">
                              {language === 'ar' ? 'شهرياً' : language === 'he' ? 'חודשי' : 'Monthly'}
                            </option>
                          </select>
                        </div>

                        {/* Number of occurrences */}
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">
                            {language === 'ar' ? 'عدد المواعيد' : language === 'he' ? 'מספר פגישות' : 'Number of Appointments'}
                          </label>
                          <select
                            value={recurringCount}
                            onChange={(e) => setRecurringCount(parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-black border border-[#C4A572] rounded-lg text-white focus:outline-none focus:border-[#FFD700]"
                          >
                            {[2, 3, 4, 5, 6, 8, 10, 12].map((count) => (
                              <option key={count} value={count}>
                                {count} {language === 'ar' ? 'مواعيد' : language === 'he' ? 'פגישות' : 'appointments'}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="bg-black/50 border border-[#FFD700]/20 rounded-lg p-4">
                        <p className="text-xs text-gray-400 mb-2">
                          {language === 'ar' ? 'معاينة المواعيد:' : language === 'he' ? 'תצוגה מקדימה:' : 'Preview:'}
                        </p>
                        <p className="text-sm text-[#FFD700]">
                          {recurringCount} {language === 'ar' ? 'مواعيد' : language === 'he' ? 'פגישות' : 'appointments'} • {
                            recurringType === 'weekly'
                              ? (language === 'ar' ? 'كل أسبوع' : language === 'he' ? 'כל שבוע' : 'every week')
                              : recurringType === 'biweekly'
                              ? (language === 'ar' ? 'كل أسبوعين' : language === 'he' ? 'כל שבועיים' : 'every 2 weeks')
                              : (language === 'ar' ? 'كل شهر' : language === 'he' ? 'כל חודש' : 'every month')
                          } • {selectedTime}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('service')}
                  className="px-8 py-4 bg-zinc-900 border-2 border-[#FFD700]/30 text-[#FFD700] font-semibold rounded-xl hover:border-[#FFD700]/60 hover:bg-[#FFD700]/10 transition-all duration-300"
                >
                  {t('back')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDateTimeNext}
                  disabled={!date || !selectedTime}
                  className="relative px-12 py-4 font-bold text-black rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] background-animate" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    {language === 'ar' ? 'التالي' : language === 'he' ? 'הבא' : 'Next'}
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </div>
            </>
          ) : step === 'contact' ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-[#FFD700] text-center flex-1">
                  {language === 'ar' ? 'معلومات الاتصال' : language === 'he' ? 'פרטי יצירת קשר' : 'Contact Information'}
                </h2>
                {customerName && (
                  <button
                    onClick={() => {
                      if (confirm(language === 'ar' ? 'هل تريد حذف المعلومات المحفوظة؟' : language === 'he' ? 'האם למחוק את המידע השמור?' : 'Clear saved information?')) {
                        localStorage.removeItem('shokha_customer_info');
                        setCustomerName('');
                        setCustomerPhone('');
                        setCustomerEmail('');
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    {language === 'ar' ? 'مسح المعلومات' : language === 'he' ? 'מחק מידע' : 'Clear Info'}
                  </button>
                )}
              </div>
              <p className="text-gray-400 text-center mb-8">
                {currentUser
                  ? (language === 'ar' ? '✓ تم تحميل معلوماتك من حسابك' : language === 'he' ? '✓ המידע שלך נטען מהחשבון' : '✓ Your info loaded from account')
                  : customerName
                  ? (language === 'ar' ? '✓ تم تحميل معلوماتك المحفوظة' : language === 'he' ? '✓ המידע שלך נטען' : '✓ Your saved info loaded')
                  : (language === 'ar' ? 'أدخل معلوماتك لتأكيد الحجز' : language === 'he' ? 'הזן את פרטיך לאישור ההזמנה' : 'Enter your details to confirm booking')
                }
              </p>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* Selected Service Summary */}
                <div className="bg-zinc-900/50 border border-[#FFD700]/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-sm">
                      {language === 'ar' ? 'الخدمة المختارة' : language === 'he' ? 'שירות נבחר' : 'Selected Service'}
                    </span>
                    <span className="text-[#FFD700] font-semibold">
                      {(() => {
                        const service = services.find(s => s.id === selectedService);
                        return language === 'ar' ? service?.nameAr : language === 'he' ? service?.nameHe : service?.nameEn;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {language === 'ar' ? 'التاريخ والوقت' : language === 'he' ? 'תאריך ושעה' : 'Date & Time'}
                    </span>
                    <span className="text-[#FFD700] font-semibold">
                      {date?.toLocaleDateString()} - {selectedTime}
                    </span>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-6">
                  {/* Name Field */}
                  <div className="relative group">
                    <label className="block text-[#FFD700] text-sm font-semibold mb-2">
                      {language === 'ar' ? 'الاسم الكامل *' : language === 'he' ? 'שם מלא *' : 'Full Name *'}
                      {currentUser && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({language === 'ar' ? 'من حسابك' : language === 'he' ? 'מהחשבון שלך' : 'from your account'})
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4A572]" />
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        disabled={!!currentUser}
                        className={`w-full pl-12 pr-4 py-3 bg-black border-2 border-[#FFD700]/30 rounded-xl text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 transition-all duration-300 ${currentUser ? 'opacity-60 cursor-not-allowed' : ''}`}
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : language === 'he' ? 'הזן את שמך המלא' : 'Enter your full name'}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field */}
                  <div className={`relative group ${currentUser && !customerPhone ? 'animate-pulse-glow' : ''}`}>
                    <label className="block text-[#FFD700] text-sm font-semibold mb-2">
                      {language === 'ar' ? 'رقم الهاتف *' : language === 'he' ? 'מספר טלפון *' : 'Phone Number *'}
                      {currentUser && !customerPhone && (
                        <span className="text-xs text-[#FFD700] ml-2 animate-pulse">
                          ({language === 'ar' ? 'املأ هذا الحقل' : language === 'he' ? 'מלא שדה זה' : 'Fill this field'})
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${currentUser && !customerPhone ? 'text-[#FFD700] animate-pulse' : phoneError ? 'text-red-500' : 'text-[#C4A572]'}`} />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => {
                          setCustomerPhone(e.target.value);
                          if (phoneError) validatePhone(e.target.value);
                        }}
                        onBlur={() => customerPhone && validatePhone(customerPhone)}
                        className={`w-full pl-12 pr-4 py-3 bg-black border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          phoneError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : currentUser && !customerPhone
                            ? 'border-[#FFD700] ring-2 ring-[#FFD700]/50 shadow-lg shadow-[#FFD700]/30'
                            : 'border-[#FFD700]/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20'
                        }`}
                        placeholder={language === 'ar' ? 'أدخل رقم هاتفك (9-15 رقم)' : language === 'he' ? 'הזן מספר טלפון (9-15 ספרות)' : 'Enter your phone number (9-15 digits)'}
                        required
                        autoFocus={!!(currentUser && !customerPhone)}
                      />
                      {phoneError && (
                        <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {phoneError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email Field (Optional) */}
                  <div className="relative group">
                    <label className="block text-[#FFD700] text-sm font-semibold mb-2">
                      {language === 'ar' ? 'البريد الإلكتروني (اختياري)' : language === 'he' ? 'דואר אלקטרוני (אופציונלי)' : 'Email (Optional)'}
                      {currentUser && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({language === 'ar' ? 'من حسابك' : language === 'he' ? 'מהחשבון שלך' : 'from your account'})
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-500' : 'text-[#C4A572]'}`} />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => {
                          setCustomerEmail(e.target.value);
                          if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={() => customerEmail && validateEmail(customerEmail)}
                        disabled={!!currentUser}
                        className={`w-full pl-12 pr-4 py-3 bg-black border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
                          emailError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-[#FFD700]/30 focus:border-[#FFD700] focus:ring-[#FFD700]/20'
                        } ${currentUser ? 'opacity-60 cursor-not-allowed' : ''}`}
                        placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : language === 'he' ? 'הזן כתובת דואר אלקטרוני' : 'Enter your email'}
                      />
                      {emailError && (
                        <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-500 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          {emailError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="flex items-start gap-3 p-4 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-[#C4A572]">
                      {language === 'ar'
                        ? 'سيتم مراجعة حجزك من قبل المالك. ستتلقى رسالة تأكيد على هاتفك عند الموافقة على الحجز.'
                        : language === 'he'
                        ? 'ההזמנה שלך תיבדק על ידי הבעלים. תקבל הודעת אישור לטלפון שלך כשההזמנה תאושר.'
                        : 'Your booking will be reviewed by the owner. You will receive a confirmation message on your phone when the booking is approved.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('datetime')}
                  className="px-8 py-4 bg-zinc-900 border-2 border-[#FFD700]/30 text-[#FFD700] font-semibold rounded-xl hover:border-[#FFD700]/60 hover:bg-[#FFD700]/10 transition-all duration-300"
                >
                  {t('back')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                  onClick={handleBooking}
                  disabled={!customerName || !customerPhone || isSubmitting || !!phoneError || !!emailError}
                  className="relative px-12 py-4 font-bold text-black rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] background-animate" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        {language === 'ar' ? 'جاري الإرسال...' : language === 'he' ? 'שולח...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        {language === 'ar' ? 'إرسال طلب الحجز' : language === 'he' ? 'שלח בקשת הזמנה' : 'Send Booking Request'}
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </>
          ) : null}
        </motion.div>

        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          @keyframes background-animate {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .background-animate {
            background-size: 200% 200%;
            animation: background-animate 3s ease infinite;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 215, 0, 0.1);
            border-radius: 3px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #FFD700, #C4A572);
            border-radius: 3px;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}