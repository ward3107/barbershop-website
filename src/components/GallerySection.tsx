import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GallerySection() {
  const { t } = useLanguage();

  // Professional barbershop images from Unsplash
  const galleryImages = [
    {
      id: 1,
      alt: 'Classic Fade Cut',
      url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=600&fit=crop',
      description: 'Precision fade with sharp lines'
    },
    {
      id: 2,
      alt: 'Professional Beard Trim',
      url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=600&fit=crop',
      description: 'Expert beard shaping and grooming'
    },
    {
      id: 3,
      alt: 'Modern Textured Cut',
      url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=600&fit=crop',
      description: 'Contemporary styling techniques'
    },
    {
      id: 4,
      alt: 'Taper Fade Perfection',
      url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop',
      description: 'Clean taper fade execution'
    },
    {
      id: 5,
      alt: 'Premium Hair Styling',
      url: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=600&h=600&fit=crop',
      description: 'Luxury grooming experience'
    },
    {
      id: 6,
      alt: 'Hot Towel Shave',
      url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&h=600&fit=crop',
      description: 'Traditional hot towel treatment'
    },
    {
      id: 7,
      alt: 'Undercut Design',
      url: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&h=600&fit=crop',
      description: 'Creative hair designs'
    },
    {
      id: 8,
      alt: 'Classic Pompadour',
      url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=600&fit=crop',
      description: 'Timeless pompadour style'
    },
    {
      id: 9,
      alt: 'Professional Grooming',
      url: 'https://images.unsplash.com/photo-1582896911227-c966f6e7fb93?w=600&h=600&fit=crop',
      description: 'Complete grooming service'
    }
  ];

  return (
    <section id="gallery" className="bg-zinc-900 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-4"
        >
          {t('ourWork')}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-center mb-12"
        >
          {t('checkOutWork')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative aspect-square bg-zinc-800 border-2 border-[#C4A572] rounded-lg overflow-hidden group cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg mb-1">{image.alt}</h3>
                  <p className="text-[#C4A572] text-sm">{image.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}