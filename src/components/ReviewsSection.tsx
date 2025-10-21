import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarHalf, User, Calendar, Send } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './Toast';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: Date;
  service?: string;
}

export default function ReviewsSection() {
  const { currentUser, userProfile } = useAuth();
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    service: ''
  });
  const { language } = useLanguage();

  useEffect(() => {
    loadReviews();
  }, []);

  // Auto-fill user details when logged in
  useEffect(() => {
    if (currentUser && userProfile) {
      setNewReview(prev => ({
        ...prev,
        name: userProfile.displayName || currentUser.email?.split('@')[0] || ''
      }));
    }
  }, [currentUser, userProfile]);

  const loadReviews = () => {
    const stored = localStorage.getItem('shokha_reviews');
    if (stored) {
      const parsed = JSON.parse(stored);
      setReviews(parsed.map((r: any) => ({
        ...r,
        date: new Date(r.date)
      })));
    }
  };

  const submitReview = () => {
    if (newReview.name && newReview.comment && newReview.rating > 0) {
      const review: Review = {
        id: `review-${Date.now()}`,
        customerName: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        service: newReview.service,
        date: new Date()
      };

      const updatedReviews = [review, ...reviews];
      localStorage.setItem('shokha_reviews', JSON.stringify(updatedReviews));
      setReviews(updatedReviews);

      // Reset form but keep it open
      setNewReview({ name: '', rating: 5, comment: '', service: '' });

      toast.success(language === 'ar'
        ? 'شكراً لتقييمك! 🌟'
        : language === 'he'
        ? 'תודה על הביקורת שלך! 🌟'
        : 'Thank you for your review! 🌟');
    }
  };

  const calculateAverageRating = (): string => {
    if (reviews.length === 0) return '0';
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className={`${sizeClasses[size]} fill-[#FFD700] text-[#FFD700]`}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className={`${sizeClasses[size]} fill-[#FFD700] text-[#FFD700]`}
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${sizeClasses[size]} text-gray-600`}
        />
      );
    }

    return stars;
  };

  const texts = {
    en: {
      title: 'Customer Reviews',
      subtitle: 'What our clients say about us',
      averageRating: 'Average Rating',
      totalReviews: 'Reviews',
      writeReview: 'Write a Review',
      yourName: 'Your Name',
      yourRating: 'Your Rating',
      service: 'Service (Optional)',
      yourReview: 'Your Review',
      submit: 'Submit Review',
      cancel: 'Cancel',
      noReviews: 'No reviews yet. Be the first to review!',
    },
    ar: {
      title: 'آراء العملاء',
      subtitle: 'ماذا يقول عملاؤنا عنا',
      averageRating: 'متوسط التقييم',
      totalReviews: 'تقييمات',
      writeReview: 'اكتب تقييماً',
      yourName: 'اسمك',
      yourRating: 'تقييمك',
      service: 'الخدمة (اختياري)',
      yourReview: 'تقييمك',
      submit: 'إرسال التقييم',
      cancel: 'إلغاء',
      noReviews: 'لا توجد تقييمات بعد. كن أول من يقيّم!',
    },
    he: {
      title: 'ביקורות לקוחות',
      subtitle: 'מה הלקוחות שלנו אומרים עלינו',
      averageRating: 'דירוג ממוצע',
      totalReviews: 'ביקורות',
      writeReview: 'כתוב ביקורת',
      yourName: 'השם שלך',
      yourRating: 'הדירוג שלך',
      service: 'שירות (אופציונלי)',
      yourReview: 'הביקורת שלך',
      submit: 'שלח ביקורת',
      cancel: 'ביטול',
      noReviews: 'עדיין אין ביקורות. היה הראשון לכתוב!',
    }
  };

  const text = texts[language as keyof typeof texts];

  return (
    <section id="reviews" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700] mb-4">
            {text.title}
          </h2>
          <p className="text-gray-400 text-lg">{text.subtitle}</p>

          {/* Average Rating Display */}
          {reviews.length > 0 && (
            <div className="mt-8 inline-block bg-zinc-900 border-2 border-[#FFD700]/30 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-[#FFD700]">
                    {calculateAverageRating()}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{text.averageRating}</div>
                </div>
                <div className="border-l border-[#FFD700]/30 pl-4">
                  <div className="flex gap-1 mb-2">
                    {renderStars(parseFloat(calculateAverageRating()), 'lg')}
                  </div>
                  <div className="text-sm text-gray-400">
                    {reviews.length} {text.totalReviews}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Review Form */}
        <div className="max-w-2xl mx-auto mb-12"
            >
              <div className="bg-zinc-900 border-2 border-[#FFD700]/30 rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder={text.yourName}
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      readOnly={!!(currentUser && userProfile)}
                      className={`w-full px-4 py-3 bg-black border border-[#C4A572] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] ${currentUser && userProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                    {currentUser && userProfile && (
                      <p className="text-xs text-gray-400 mt-1">Logged in as {userProfile.displayName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-2">{text.yourRating}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= newReview.rating
                                ? 'fill-[#FFD700] text-[#FFD700]'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder={text.service}
                    value={newReview.service}
                    onChange={(e) => setNewReview({ ...newReview, service: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-[#C4A572] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  />

                  <textarea
                    placeholder={text.yourReview}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-black border border-[#C4A572] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] resize-none"
                  />

                  <button
                    onClick={submitReview}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {text.submit}
                  </button>
                </div>
              </div>
            </div>

        {/* Reviews List */}
        <div className="max-w-4xl mx-auto space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Star className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>{text.noReviews}</p>
            </div>
          ) : (
            <AnimatePresence>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 border border-[#FFD700]/20 rounded-xl p-6 hover:border-[#FFD700]/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#FFD700] to-[#C4A572] rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-black" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {review.customerName}
                          </h3>
                          {review.service && (
                            <p className="text-sm text-gray-400">{review.service}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          {review.date.toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-1 mb-3">
                        {renderStars(review.rating, 'sm')}
                      </div>

                      <p className="text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
}
