import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HomeSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="bg-black py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
        >
          {t('welcomeTitle')} <span className="text-[#C4A572]">{t('kingdomKutz')}</span>
        </motion.h2>

        <div className="space-y-8 text-gray-300 text-lg leading-relaxed">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t('para1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {t('para2')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            {t('para3')}
          </motion.p>
        </div>
      </div>
    </section>
  );
}