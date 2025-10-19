import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Award, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  service: string;
  comment: string;
  date: Date;
  verified: boolean;
}

// Mock storage key
const REVIEWS_KEY = 'shokha_reviews';

export default function RatingSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: '',
    rating: 5,
    service: '',
    comment: ''
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const { language } = useLanguage();

  // Load reviews from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(REVIEWS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setReviews(parsed.map((r: any) => ({
        ...r,
        date: new Date(r.date)
      })));
    } else {
      // Add some sample reviews
      const sampleReviews: Review[] = [
        {
          id: '1',
          customerName: 'أحمد محمود',
          rating: 5,
          service: 'قص شعر وذقن',
          comment: 'خدمة ممتازة! شكرا شوخا على الاحترافية',
          date: new Date('2024-01-15'),
          verified: true
        },
        {
          id: '2',
          customerName: 'יוסי כהן',
          rating: 5,
          service: 'תספורת',
          comment: 'המספרה הכי טובה בכפר יאסיף! ממליץ בחום',
          date: new Date('2024-01-10'),
          verified: true
        },
        {
          id: '3',
          customerName: 'Michael Brown',
          rating: 4,
          service: 'Beard Trim',
          comment: 'Great experience, professional service',
          date: new Date('2024-01-05'),
          verified: true
        }
      ];
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(sampleReviews));
      setReviews(sampleReviews);
    }
  }, []);

  const handleSubmitReview = () => {
    if (newReview.customerName && newReview.comment && newReview.service) {
      const review: Review = {
        id: Date.now().toString(),
        ...newReview,
        date: new Date(),
        verified: false
      };

      const updatedReviews = [review, ...reviews];
      setReviews(updatedReviews);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));

      // Reset form
      setNewReview({ customerName: '', rating: 5, service: '', comment: '' });
      setShowReviewForm(false);

      // Show success message
      alert(language === 'ar' ? 'شكراً لتقييمك!' : language === 'he' ? 'תודה על הדירוג!' : 'Thank you for your review!');
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
    : 5;

  // Count ratings by star
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0
  }));

  const texts = {
    ar: {
      title: 'تقييمات العملاء',
      writeReview: 'اكتب تقييمك',
      averageRating: 'التقييم العام',
      totalReviews: 'إجمالي التقييمات',
      yourName: 'اسمك',
      service: 'الخدمة',
      yourComment: 'تعليقك',
      submit: 'إرسال التقييم',
      cancel: 'إلغاء',
      verified: 'عميل موثق',
      rateExperience: 'قيم تجربتك',
      services: ['قص شعر', 'تشذيب ذقن', 'قص شعر وذقن']
    },
    en: {
      title: 'Customer Reviews',
      writeReview: 'Write a Review',
      averageRating: 'Average Rating',
      totalReviews: 'Total Reviews',
      yourName: 'Your Name',
      service: 'Service',
      yourComment: 'Your Comment',
      submit: 'Submit Review',
      cancel: 'Cancel',
      verified: 'Verified Customer',
      rateExperience: 'Rate Your Experience',
      services: ['Haircut', 'Beard Trim', 'Hair + Beard']
    },
    he: {
      title: 'ביקורות לקוחות',
      writeReview: 'כתוב ביקורת',
      averageRating: 'דירוג ממוצע',
      totalReviews: 'סך הביקורות',
      yourName: 'שמך',
      service: 'שירות',
      yourComment: 'התגובה שלך',
      submit: 'שלח ביקורת',
      cancel: 'ביטול',
      verified: 'לקוח מאומת',
      rateExperience: 'דרג את החוויה שלך',
      services: ['תספורת', 'גילוח זקן', 'תספורת וזקן']
    }
  };

  const t = texts[language as keyof typeof texts];

  return (
    <div className="bg-black py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            {t.title}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${i < Math.floor(averageRating) ? 'fill-[#FFD700] text-[#FFD700]' : 'text-zinc-600'}`}
              />
            ))}
            <span className="text-2xl font-bold text-white ml-2">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-gray-400">
            {t.totalReviews}: {reviews.length}
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6 text-center"
          >
            <Award className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
            <div className="text-3xl font-bold text-[#FFD700]">{averageRating.toFixed(1)}/5</div>
            <p className="text-gray-400">{t.averageRating}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6 text-center"
          >
            <Users className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
            <div className="text-3xl font-bold text-[#FFD700]">{reviews.length}</div>
            <p className="text-gray-400">{t.totalReviews}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6 text-center"
          >
            <TrendingUp className="w-12 h-12 text-[#FFD700] mx-auto mb-3" />
            <div className="text-3xl font-bold text-[#FFD700]">
              {Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100)}%
            </div>
            <p className="text-gray-400">Satisfaction</p>
          </motion.div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6 mb-12">
          <div className="space-y-3">
            {ratingCounts.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-[#FFD700] font-semibold">{star}</span>
                  <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                </div>
                <div className="flex-1 bg-zinc-800 rounded-full h-6 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: star * 0.1 }}
                    className="h-full bg-gradient-to-r from-[#FFD700] to-[#C4A572]"
                  />
                </div>
                <span className="text-gray-400 text-sm w-12 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="text-center mb-12">
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-xl hover:from-[#C4A572] hover:to-[#FFD700] transition-all duration-300 transform hover:scale-105"
          >
            <MessageSquare className="inline-block w-5 h-5 mr-2" />
            {t.writeReview}
          </button>
        </div>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowReviewForm(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-zinc-900 border-2 border-[#FFD700]/50 rounded-2xl p-8 max-w-lg w-full"
              >
                <h3 className="text-2xl font-bold text-[#FFD700] mb-6">{t.rateExperience}</h3>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= (hoveredStar || newReview.rating)
                            ? 'fill-[#FFD700] text-[#FFD700]'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={t.yourName}
                    value={newReview.customerName}
                    onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
                    className="w-full px-4 py-3 bg-black border-2 border-[#FFD700]/30 rounded-lg text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none"
                  />

                  <select
                    value={newReview.service}
                    onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                    className="w-full px-4 py-3 bg-black border-2 border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
                  >
                    <option value="">{t.service}</option>
                    {t.services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>

                  <textarea
                    placeholder={t.yourComment}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black border-2 border-[#FFD700]/30 rounded-lg text-white placeholder-gray-500 focus:border-[#FFD700] focus:outline-none resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="flex-1 px-6 py-3 bg-zinc-800 text-gray-400 rounded-lg hover:bg-zinc-700 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:from-[#C4A572] hover:to-[#FFD700] transition-all"
                  >
                    {t.submit}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="grid gap-6">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 border border-[#FFD700]/20 rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{review.customerName}</h4>
                  <p className="text-sm text-gray-400">{review.service}</p>
                </div>
                <div className="flex items-center gap-2">
                  {review.verified && (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                      {t.verified}
                    </span>
                  )}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-[#FFD700] text-[#FFD700]' : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-3">{review.comment}</p>
              <p className="text-xs text-gray-500">{review.date.toLocaleDateString()}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}