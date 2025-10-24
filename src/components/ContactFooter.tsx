import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Mail, Phone, MapPin, Clock, Scissors } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import AdminLoginModal from './AdminLoginModal';

export default function ContactFooter() {
  const { language } = useLanguage();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

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
              <button
                onClick={() => setAdminModalOpen(true)}
                className="block text-gray-300 hover:text-[#FFD700] transition-colors text-sm w-full text-left"
                title="Admin Access"
              >
                {language === 'ar' ? 'لوحة التحكم' : language === 'he' ? 'ניהול' : 'Admin'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFD700]/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-gray-500 text-sm text-center">
              © {new Date().getFullYear()} SHOKHA BARBERSHOP. {text.rights}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Login Popup Modal */}
      <AdminLoginModal open={adminModalOpen} onOpenChange={setAdminModalOpen} />
    </footer>
  );
}
