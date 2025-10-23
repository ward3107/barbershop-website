import { useState, useEffect } from 'react';
import BookingSystem from './BookingSystem';
import { Bell, Shield, Settings, LogOut, AlertTriangle, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './Toast';
import { motion } from 'framer-motion';

export default function OwnerDashboard() {
  const { currentUser, userProfile, isOwner, isAdmin, logout } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();

  // Owner or Admin can access
  const hasOwnerAccess = isOwner() || isAdmin();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : language === 'he' ? 'התנתקת בהצלחה' : 'Logged out successfully');
    } catch (error) {
      toast.error(language === 'ar' ? 'خطأ في تسجيل الخروج' : language === 'he' ? 'שגיאה בהתנתקות' : 'Error logging out');
    }
  };

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#FFD700]">
              {language === 'ar' ? 'لوحة تحكم المالك' : language === 'he' ? 'לוח בקרה של הבעלים' : 'SHOKHA Owner'}
            </h1>
            <p className="text-gray-400 mt-2">
              {language === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى لوحة التحكم' : language === 'he' ? 'אנא התחבר כדי לגשת ללוח הבקרה' : 'Please log in to access the dashboard'}
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
          >
            {language === 'ar' ? 'الذهاب لتسجيل الدخول' : language === 'he' ? 'עבור להתחברות' : 'Go to Login'}
          </button>
        </motion.div>
      </div>
    );
  }

  // User is logged in but doesn't have owner access
  if (!hasOwnerAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border-2 border-red-500 rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-500">
              {language === 'ar' ? 'الوصول مرفوض' : language === 'he' ? 'גישה נדחתה' : 'Access Denied'}
            </h1>
            <p className="text-gray-400 mt-2">
              {language === 'ar'
                ? 'ليس لديك صلاحيات المالك. اتصل بالمالك لطلب الوصول.'
                : language === 'he'
                ? 'אין לך הרשאות בעלים. צור קשר עם הבעלים לבקשת גישה.'
                : "You don't have owner privileges. Contact the owner to request access."}
            </p>
            <p className="text-gray-500 text-sm mt-4">
              {language === 'ar' ? 'مسجل الدخول كـ:' : language === 'he' ? 'מחובר כ:' : 'Logged in as:'} {userProfile?.email}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all"
            >
              {language === 'ar' ? 'تسجيل الخروج' : language === 'he' ? 'התנתק' : 'Logout'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-all"
            >
              {language === 'ar' ? 'الذهاب للصفحة الرئيسية' : language === 'he' ? 'עבור לדף הבית' : 'Go to Home'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-900 border-b border-[#FFD700]/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#FFD700]" />
            <h1 className="text-2xl font-bold text-[#FFD700]">SHOKHA Owner Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#C4A572] hover:text-[#FFD700] transition-colors">
              <Bell className="w-6 h-6" />
            </button>
            <button className="p-2 text-[#C4A572] hover:text-[#FFD700] transition-colors">
              <Settings className="w-6 h-6" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all"
            >
              <LogOut className="w-5 h-5" />
              {language === 'ar' ? 'خروج' : language === 'he' ? 'יציאה' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <BookingSystem isOwner={true} />
      </div>

      {/* Instructions */}
      <div className="container mx-auto px-6 pb-6">
        <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6">
          <h2 className="text-xl font-bold text-[#FFD700] mb-4">
            {language === 'ar' ? 'كيفية استخدام النظام' : language === 'he' ? 'איך להשתמש במערכת' : 'How to Use'}
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li>✅ {language === 'ar' ? 'اضغط على "موافقة" لتأكيد الحجز' : language === 'he' ? 'לחץ על "אשר" כדי לאשר הזמנה' : 'Click "Approve" to confirm booking'}</li>
            <li>❌ {language === 'ar' ? 'اضغط على "رفض" لإلغاء الحجز' : language === 'he' ? 'לחץ על "דחה" כדי לבטל הזמנה' : 'Click "Reject" to cancel booking'}</li>
            <li>📱 {language === 'ar' ? 'سيتم إرسال رسالة WhatsApp للعميل تلقائياً' : language === 'he' ? 'הודעת WhatsApp תישלח ללקוח אוטומטית' : 'WhatsApp message will be sent to customer automatically'}</li>
            <li>📅 {language === 'ar' ? 'العملاء يمكنهم إضافة المواعيد المؤكدة للتقويم' : language === 'he' ? 'לקוחות יכולים להוסיף פגישות מאושרות ליומן' : 'Customers can add confirmed appointments to calendar'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}