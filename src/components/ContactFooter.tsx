import { motion } from 'framer-motion';
import { Instagram, Mail, Phone, MapPin, Clock, Scissors } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContactFooter() {
  const { language } = useLanguage();

  const contactInfo = {
    instagram: 'https://www.instagram.com/shokha_barber_shop?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    phone: '0527412003',
    email: 'contact@shokha.com', // You can update this if you have a specific email
    address: 'Kfar Yassif, Israel',
    hours: {
      en: 'Sun-Fri: 9:00 AM - 9:00 PM',
      ar: 'الأحد - الجمعة: 9:00 صباحاً - 9:00 مساءً',
      he: 'א׳-ו׳: 9:00 - 21:00'
    }
  };

  const texts = {
    en: {
      title: 'Get in Touch',
      followUs: 'Follow Us',
      callUs: 'Call Us',
      emailUs: 'Email Us',
      visitUs: 'Visit Us',
      openingHours: 'Opening Hours',
      rights: 'All rights reserved.',
      tagline: 'Premium Grooming Experience'
    },
    ar: {
      title: 'تواصل معنا',
      followUs: 'تابعنا',
      callUs: 'اتصل بنا',
      emailUs: 'راسلنا',
      visitUs: 'زورنا',
      openingHours: 'ساعات العمل',
      rights: 'جميع الحقوق محفوظة.',
      tagline: 'تجربة حلاقة فاخرة'
    },
    he: {
      title: 'צור קשר',
      followUs: 'עקוב אחרינו',
      callUs: 'התקשר אלינו',
      emailUs: 'שלח אימייל',
      visitUs: 'בקר אותנו',
      openingHours: 'שעות פתיחה',
      rights: 'כל הזכויות שמורות.',
      tagline: 'חוויית טיפוח מקצועית'
    }
  };

  const text = texts[language as keyof typeof texts];

  return (
    <footer className="bg-black border-t-2 border-[#FFD700]/30">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Scissors className="w-8 h-8 text-[#FFD700]" />
              <h3 className="text-2xl font-bold text-[#FFD700]">SHOKHA</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">{text.tagline}</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <motion.a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#C4A572] rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
              >
                <Instagram className="w-6 h-6 text-black" />
              </motion.a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-[#FFD700] mb-4">{text.title}</h4>
            <div className="space-y-3">
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-3 text-gray-300 hover:text-[#FFD700] transition-colors justify-center md:justify-start group"
              >
                <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm" dir="ltr">{contactInfo.phone}</span>
              </a>

              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-gray-300 hover:text-[#FFD700] transition-colors justify-center md:justify-start group"
              >
                <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-[#FFD700]/20 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">{contactInfo.email}</span>
              </a>

              <div className="flex items-center gap-3 text-gray-300 justify-center md:justify-start">
                <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">{contactInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-[#FFD700] mb-4">{text.openingHours}</h4>
            <div className="flex items-start gap-3 text-gray-300 justify-center md:justify-start">
              <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="w-4 h-4 text-[#FFD700]" />
              </div>
              <div className="text-sm">
                <p>{contactInfo.hours[language as keyof typeof contactInfo.hours]}</p>
                <p className="text-gray-500 mt-1">
                  {language === 'ar' ? 'مغلق يوم السبت' : language === 'he' ? 'סגור בשבת' : 'Closed Saturday'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold text-[#FFD700] mb-4">
              {language === 'ar' ? 'روابط سريعة' : language === 'he' ? 'קישורים מהירים' : 'Quick Links'}
            </h4>
            <div className="space-y-2">
              <a
                href="#home"
                className="block text-gray-300 hover:text-[#FFD700] transition-colors text-sm"
              >
                {language === 'ar' ? 'الرئيسية' : language === 'he' ? 'בית' : 'Home'}
              </a>
              <a
                href="#gallery"
                className="block text-gray-300 hover:text-[#FFD700] transition-colors text-sm"
              >
                {language === 'ar' ? 'المعرض' : language === 'he' ? 'גלריה' : 'Gallery'}
              </a>
              <a
                href="#reviews"
                className="block text-gray-300 hover:text-[#FFD700] transition-colors text-sm"
              >
                {language === 'ar' ? 'التقييمات' : language === 'he' ? 'ביקורות' : 'Reviews'}
              </a>
              <a
                href="#admin"
                className="block text-gray-300 hover:text-[#FFD700] transition-colors text-sm opacity-50 hover:opacity-100"
              >
                {language === 'ar' ? 'لوحة التحكم' : language === 'he' ? 'ניהול' : 'Admin'}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFD700]/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {new Date().getFullYear()} SHOKHA BARBERSHOP. {text.rights}
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>
                {language === 'ar' ? 'تم التطوير بواسطة' : language === 'he' ? 'פותח על ידי' : 'Developed with'}
              </span>
              <span className="text-[#FFD700]">Claude Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <motion.a
        href={`https://wa.me/972${contactInfo.phone.substring(1)}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 hover:shadow-green-500/70 transition-all"
        title="WhatsApp"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </motion.a>
    </footer>
  );
}
