import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VideoItem {
  id: string;
  title: string;
  titleAr: string;
  titleHe: string;
  thumbnail: string;
  videoUrl: string;
  description?: string;
  descriptionAr?: string;
  descriptionHe?: string;
}

// SHOKHA Barbershop Videos
const videos: VideoItem[] = [
  {
    id: '1',
    title: 'Professional Haircut',
    titleAr: 'قص شعر احترافي',
    titleHe: 'תספורת מקצועית',
    thumbnail: 'https://img.youtube.com/vi/NXUK1t0HN7k/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/NXUK1t0HN7k',
    description: 'Watch our master barber at work',
    descriptionAr: 'شاهد الحلاق الخبير في العمل',
    descriptionHe: 'צפה בספר המומחה שלנו בעבודה'
  },
  {
    id: '2',
    title: 'Precision Cut',
    titleAr: 'قص دقيق',
    titleHe: 'חיתוך מדויק',
    thumbnail: 'https://img.youtube.com/vi/oyI6fqVo7Mw/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/oyI6fqVo7Mw',
    description: 'Expert barbering techniques',
    descriptionAr: 'تقنيات الحلاقة الخبيرة',
    descriptionHe: 'טכניקות ספרות מומחה'
  },
  {
    id: '3',
    title: 'Style Transformation',
    titleAr: 'تحول الأسلوب',
    titleHe: 'שינוי סגנון',
    thumbnail: 'https://img.youtube.com/vi/3tl3vXdl5_Y/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/3tl3vXdl5_Y',
    description: 'Complete style makeover',
    descriptionAr: 'تجديد كامل للمظهر',
    descriptionHe: 'מהפך מלא בסגנון'
  },
  {
    id: '4',
    title: 'Modern Fade',
    titleAr: 'فيد حديث',
    titleHe: 'פייד מודרני',
    thumbnail: 'https://img.youtube.com/vi/9KSHpVZY_sU/maxresdefault.jpg',
    videoUrl: 'https://www.youtube.com/embed/9KSHpVZY_sU',
    description: 'Perfect fade techniques',
    descriptionAr: 'تقنيات الفيد المثالية',
    descriptionHe: 'טכניקות פייד מושלמות'
  }
];

export default function VideoGallery() {
  const { language } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const texts = {
    en: {
      title: 'Video Gallery',
      subtitle: 'Watch our work in action',
      watch: 'Watch Video',
      close: 'Close',
      previous: 'Previous',
      next: 'Next'
    },
    ar: {
      title: 'معرض الفيديو',
      subtitle: 'شاهد أعمالنا',
      watch: 'شاهد الفيديو',
      close: 'إغلاق',
      previous: 'السابق',
      next: 'التالي'
    },
    he: {
      title: 'גלריית וידאו',
      subtitle: 'צפה בעבודות שלנו',
      watch: 'צפה בסרטון',
      close: 'סגור',
      previous: 'הקודם',
      next: 'הבא'
    }
  };

  const text = texts[language as keyof typeof texts];

  const openVideo = (video: VideoItem, index: number) => {
    setSelectedVideo(video);
    setCurrentVideoIndex(index);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  const goToNext = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setSelectedVideo(videos[nextIndex]);
    setCurrentVideoIndex(nextIndex);
  };

  const goToPrevious = () => {
    const prevIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
    setSelectedVideo(videos[prevIndex]);
    setCurrentVideoIndex(prevIndex);
  };

  const getVideoTitle = (video: VideoItem) => {
    if (language === 'ar') return video.titleAr;
    if (language === 'he') return video.titleHe;
    return video.title;
  };

  const getVideoDescription = (video: VideoItem) => {
    if (language === 'ar') return video.descriptionAr;
    if (language === 'he') return video.descriptionHe;
    return video.description;
  };

  return (
    <section id="videos" className="py-20 bg-gradient-to-b from-black to-zinc-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <Video className="w-12 h-12 text-[#FFD700] mx-auto" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            {text.title}
          </h2>
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <button
                onClick={() => openVideo(video, index)}
                className="w-full relative overflow-hidden rounded-xl border-2 border-[#FFD700]/30 hover:border-[#FFD700] transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-zinc-900">
                  <img
                    src={video.thumbnail}
                    alt={getVideoTitle(video)}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center"
                    >
                      <Play className="w-8 h-8 text-black ml-1" />
                    </motion.div>
                  </div>
                </div>

                {/* Title */}
                <div className="p-4 bg-zinc-900 border-t border-[#FFD700]/20">
                  <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                    {getVideoTitle(video)}
                  </h3>
                  {getVideoDescription(video) && (
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {getVideoDescription(video)}
                    </p>
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl"
            >
              {/* Close Button */}
              <button
                onClick={closeVideo}
                className="absolute -top-12 right-0 text-white hover:text-[#FFD700] transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Video Container */}
              <div className="relative rounded-xl overflow-hidden border-2 border-[#FFD700]/50 shadow-2xl shadow-[#FFD700]/20">
                <div className="aspect-video bg-black">
                  <iframe
                    src={selectedVideo.videoUrl}
                    title={getVideoTitle(selectedVideo)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Video Info */}
                <div className="bg-gradient-to-r from-zinc-900 to-black p-6 border-t border-[#FFD700]/30">
                  <h3 className="text-2xl font-bold text-[#FFD700] mb-2">
                    {getVideoTitle(selectedVideo)}
                  </h3>
                  {getVideoDescription(selectedVideo) && (
                    <p className="text-gray-300">
                      {getVideoDescription(selectedVideo)}
                    </p>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border-2 border-[#FFD700]/30 text-white rounded-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>{text.previous}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border-2 border-[#FFD700]/30 text-white rounded-lg hover:border-[#FFD700] hover:text-[#FFD700] transition-all"
                >
                  <span>{text.next}</span>
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
