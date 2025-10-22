import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Calendar, Award, LogOut, Clock, CheckCircle, XCircle, Star, Ban } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getDb } from '@/services/firebase';
import { cancelBooking } from '@/services/bookingService';

interface UserAccountProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRebook?: (booking: any) => void;
}

interface Booking {
  id: string;
  service: string;
  date: Date;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  notes?: string;
}

export default function UserAccount({ open, onOpenChange, onRebook }: UserAccountProps) {
  const { currentUser, userProfile, logout } = useAuth();
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'rewards'>('profile');

  const texts = {
    en: {
      title: 'My Account',
      profile: 'Profile',
      bookings: 'My Bookings',
      rewards: 'Rewards',
      logout: 'Logout',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      member: 'Member Since',
      totalBookings: 'Total Bookings',
      loyaltyPoints: 'Loyalty Points',
      noBookings: 'No bookings yet',
      bookNow: 'Book your first appointment',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      rebook: 'Rebook',
      cancel: 'Cancel',
      reschedule: 'Reschedule',
      cancelConfirm: 'Are you sure you want to cancel this appointment?',
      cancelSuccess: 'Appointment cancelled successfully',
      pointsInfo: 'Earn 10 points for every completed appointment!',
      rewardsAvailable: 'Available Rewards',
      pointsNeeded: 'points needed',
      comingSoon: 'Coming Soon'
    },
    ar: {
      title: 'حسابي',
      profile: 'الملف الشخصي',
      bookings: 'حجوزاتي',
      rewards: 'المكافآت',
      logout: 'تسجيل الخروج',
      name: 'الاسم',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      member: 'عضو منذ',
      totalBookings: 'إجمالي الحجوزات',
      loyaltyPoints: 'نقاط الولاء',
      noBookings: 'لا توجد حجوزات بعد',
      bookNow: 'احجز موعدك الأول',
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      rebook: 'إعادة الحجز',
      cancel: 'إلغاء',
      reschedule: 'إعادة الجدولة',
      cancelConfirm: 'هل أنت متأكد من إلغاء هذا الموعد؟',
      cancelSuccess: 'تم إلغاء الموعد بنجاح',
      pointsInfo: 'احصل على 10 نقاط مقابل كل موعد مكتمل!',
      rewardsAvailable: 'المكافآت المتاحة',
      pointsNeeded: 'نقاط مطلوبة',
      comingSoon: 'قريباً'
    },
    he: {
      title: 'החשבון שלי',
      profile: 'פרופיל',
      bookings: 'ההזמנות שלי',
      rewards: 'תגמולים',
      logout: 'התנתק',
      name: 'שם',
      email: 'אימייל',
      phone: 'טלפון',
      member: 'חבר מאז',
      totalBookings: 'סה״כ הזמנות',
      loyaltyPoints: 'נקודות נאמנות',
      noBookings: 'עדיין אין הזמנות',
      bookNow: 'הזמן את התור הראשון שלך',
      pending: 'ממתין',
      approved: 'אושר',
      rejected: 'נדחה',
      rebook: 'הזמן שוב',
      cancel: 'בטל',
      reschedule: 'שנה מועד',
      cancelConfirm: 'האם אתה בטוח שברצונך לבטל את התור הזה?',
      cancelSuccess: 'התור בוטל בהצלחה',
      pointsInfo: 'הרווח 10 נקודות עבור כל תור שהושלם!',
      rewardsAvailable: 'תגמולים זמינים',
      pointsNeeded: 'נקודות נדרשות',
      comingSoon: 'בקרוב'
    }
  };

  const text = texts[language as keyof typeof texts];

  // Handle browser back button
  useEffect(() => {
    if (open) {
      // Push a new state when modal opens
      window.history.pushState({ modal: 'account' }, '');

      const handlePopState = () => {
        onOpenChange(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [open, onOpenChange]);

  // Load user bookings
  useEffect(() => {
    if (open && currentUser) {
      loadBookings();
    }
  }, [open, currentUser]);

  const loadBookings = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const q = query(
        collection(getDb(), 'bookings'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const bookingsData: Booking[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({
          id: doc.id,
          service: data.service,
          date: data.date.toDate(),
          time: data.time,
          status: data.status,
          createdAt: data.createdAt.toDate(),
          notes: data.notes
        });
      });

      setBookings(bookingsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm(text.cancelConfirm)) return;

    try {
      await cancelBooking(bookingId);
      alert(text.cancelSuccess);
      loadBookings(); // Reload to show updated status
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 border-red-500/50 text-red-400';
      default:
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
    }
  };

  if (!open || !currentUser || !userProfile) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-zinc-900 to-black border-2 border-[#FFD700]/30 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.1)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(196,165,114,0.1)_0%,transparent_50%)] pointer-events-none" />

        {/* Header */}
        <div className="border-b border-[#FFD700]/30 p-3 md:p-6 relative z-10">
          <div className="flex items-center justify-between mb-3 md:mb-0">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-[#FFD700] to-[#C4A572] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <div>
                <h2 className="text-base md:text-2xl font-bold text-[#FFD700]">
                  {language === 'ar' ? 'مرحباً' : language === 'he' ? 'שלום' : 'Hi'}, {userProfile.displayName}!
                </h2>
                <p className="text-gray-400 text-xs md:text-sm hidden md:block">{userProfile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-xs md:text-base"
              >
                <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden md:inline">{text.logout}</span>
              </motion.button>
              <button
                onClick={() => onOpenChange(false)}
                className="text-gray-400 hover:text-[#FFD700] transition-colors"
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 md:gap-2 mt-3 md:mt-6">
            {(['profile', 'bookings', 'rewards'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg font-medium transition-all text-xs md:text-base ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black'
                    : 'bg-black/50 text-gray-400 hover:text-[#FFD700]'
                }`}
              >
                {text[tab]}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-6 pb-6 md:pb-8 overflow-y-auto max-h-[calc(90vh-180px)] md:max-h-[calc(90vh-160px)] relative z-10">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4">
              <div className="bg-black/50 border border-[#FFD700]/30 rounded-lg p-3 md:p-6">
                <h3 className="text-[#FFD700] font-bold mb-3 md:mb-4 text-sm md:text-base">{text.profile}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">{text.name}</p>
                    <p className="text-white font-medium">{userProfile.displayName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">{text.email}</p>
                    <p className="text-white font-medium">{userProfile.email}</p>
                  </div>
                  {userProfile.phone && (
                    <div>
                      <p className="text-gray-400 text-sm">{text.phone}</p>
                      <p className="text-white font-medium" dir="ltr">{userProfile.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm">{text.member}</p>
                    <p className="text-white font-medium">
                      {userProfile.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-black/50 border border-[#FFD700]/30 rounded-lg p-3 md:p-6">
                <h3 className="text-[#FFD700] font-bold mb-3 md:mb-4 text-sm md:text-base">Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{text.totalBookings}</p>
                      <p className="text-2xl font-bold text-white">{userProfile.totalBookings}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{text.loyaltyPoints}</p>
                      <p className="text-2xl font-bold text-white">{userProfile.loyaltyPoints}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">{text.noBookings}</p>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg"
                  >
                    {text.bookNow}
                  </button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-black/50 border border-[#FFD700]/30 rounded-lg p-4 hover:border-[#FFD700]/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-[#FFD700] font-bold">{booking.service}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {text[booking.status as keyof typeof text]}
                          </span>
                        </div>
                        <div className="text-gray-400 text-sm space-y-1">
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {booking.date.toLocaleDateString()}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {booking.status === 'approved' && onRebook && (
                          <motion.button
                            onClick={() => onRebook(booking)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-[#FFD700]/20 border border-[#FFD700]/50 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/30 transition-all text-sm"
                          >
                            {text.rebook}
                          </motion.button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'approved') && (
                          <motion.button
                            onClick={() => handleCancel(booking.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm flex items-center gap-2"
                          >
                            <Ban className="w-4 h-4" />
                            {text.cancel}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#C4A572]/20 border border-[#FFD700]/30 rounded-lg p-6 text-center">
                <Award className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
                <p className="text-3xl font-bold text-[#FFD700] mb-2">{userProfile.loyaltyPoints}</p>
                <p className="text-gray-400">{text.loyaltyPoints}</p>
                <p className="text-gray-500 text-sm mt-4">{text.pointsInfo}</p>
              </div>

              <div>
                <h3 className="text-[#FFD700] font-bold mb-4">{text.rewardsAvailable}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: '10% Discount', points: 50, icon: Star },
                    { name: 'Free Beard Trim', points: 100, icon: Star },
                    { name: '20% Discount', points: 150, icon: Star },
                    { name: 'Free Haircut', points: 200, icon: Star }
                  ].map((reward, index) => (
                    <div
                      key={index}
                      className={`bg-black/50 border rounded-lg p-4 ${
                        userProfile.loyaltyPoints >= reward.points
                          ? 'border-[#FFD700]/50'
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <reward.icon className="w-6 h-6 text-[#FFD700]" />
                        <h4 className="text-white font-medium">{reward.name}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {reward.points} {text.pointsNeeded}
                      </p>
                      <div className="mt-3 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FFD700] to-[#C4A572] transition-all"
                          style={{ width: `${Math.min((userProfile.loyaltyPoints / reward.points) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-yellow-500 text-xs mt-2 text-center">{text.comingSoon}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
