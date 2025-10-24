import { motion } from 'framer-motion';
import { MapPin, Phone, Instagram } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LocationSection() {
  const { language } = useLanguage();

  const contactInfo = {
    phone: '0527412003',
    instagram: 'https://www.instagram.com/shokha_barber_shop?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    address: {
      en: 'Kfar Yassif, Israel',
      ar: 'كفر ياسيف، إسرائيل',
      he: 'כפר יאסיף, ישראל'
    },
    // Google Maps embed URL for Kfar Yassif (you can customize this with exact location)
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13404.285366586857!2d35.16!3d32.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151db4c8c82cf5a9%3A0x5b2f3e6c4c1e6d82!2sKfar%20Yasif!5e0!3m2!1sen!2sil!4v1234567890',
    // Direct Google Maps link for "Get Directions" button
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Kfar+Yassif+Israel'
  };

  const texts = {
    en: {
      title: 'Visit Us',
      subtitle: 'Find Your Way to Premium Grooming',
      address: 'Our Location',
      getDirections: 'Get Directions',
      callUs: 'Call Us',
      followUs: 'Follow on Instagram',
      openMap: 'Open in Google Maps'
    },
    ar: {
      title: 'زورنا',
      subtitle: 'اعثر على طريقك إلى الحلاقة الفاخرة',
      address: 'موقعنا',
      getDirections: 'احصل على الاتجاهات',
      callUs: 'اتصل بنا',
      followUs: 'تابعنا على إنستغرام',
      openMap: 'افتح في خرائط جوجل'
    },
    he: {
      title: 'בקר אותנו',
      subtitle: 'מצא את הדרך לטיפוח מקצועי',
      address: 'המיקום שלנו',
      getDirections: 'קבל הוראות הגעה',
      callUs: 'התקשר אלינו',
      followUs: 'עקוב באינסטגרם',
      openMap: 'פתח במפות Google'
    }
  };

  const text = texts[language as keyof typeof texts];

  return (
    <section id="location" className="py-20 bg-gradient-to-b from-black to-zinc-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.05)_0%,transparent_65%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C4A572]/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#FFD700] to-[#C4A572] bg-clip-text text-transparent">
              {text.title}
            </span>
          </h2>
          <p className="text-gray-400 text-lg">{text.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Map Container */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border-2 border-[#FFD700]/30 shadow-2xl shadow-[#FFD700]/10">
              <div className="aspect-video w-full">
                <iframe
                  src={contactInfo.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                  title="SHOKHA Barbershop Location"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Address Card */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/30 rounded-2xl p-6 hover:border-[#FFD700]/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#C4A572] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-2">{text.address}</h3>
                  <p className="text-gray-300 text-lg">
                    {contactInfo.address[language as keyof typeof contactInfo.address]}
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <motion.a
              href={`tel:${contactInfo.phone}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/30 rounded-2xl p-6 hover:border-[#FFD700]/50 hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-1">{text.callUs}</h3>
                  <p className="text-gray-300 text-2xl font-mono" dir="ltr">{contactInfo.phone}</p>
                </div>
              </div>
            </motion.a>

            {/* Instagram Card */}
            <motion.a
              href={contactInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/30 rounded-2xl p-6 hover:border-[#FFD700]/50 hover:shadow-lg hover:shadow-[#FFD700]/20 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#FFD700] mb-1">{text.followUs}</h3>
                  <p className="text-gray-300 text-sm">@shokha_barber_shop</p>
                </div>
              </div>
            </motion.a>

            {/* Hours Quick Info */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/30 rounded-2xl p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">
                  {language === 'ar' ? 'ساعات العمل' : language === 'he' ? 'שעות פתיחה' : 'Opening Hours'}
                </p>
                <p className="text-[#FFD700] font-bold text-lg">
                  {language === 'ar' ? 'الأحد - الجمعة' : language === 'he' ? 'א׳-ו׳' : 'Sun-Fri'}
                </p>
                <p className="text-gray-300 text-xl font-mono mt-1">9:00 - 21:00</p>
                <p className="text-gray-500 text-sm mt-2">
                  {language === 'ar' ? 'مغلق يوم السبت' : language === 'he' ? 'סגור בשבת' : 'Closed Saturday'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
