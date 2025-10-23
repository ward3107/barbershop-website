import { useState, useEffect } from 'react';
import BookingSystem from './BookingSystem';
import { Bell, Shield, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// ⚠️ SECURITY WARNING: This is a temporary solution.
// For production, implement Firebase Authentication with custom claims.
// See: https://firebase.google.com/docs/auth/admin/custom-claims
const OWNER_PASSWORD = import.meta.env.VITE_OWNER_PASSWORD || 'shokha2024';

export default function OwnerDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const { language } = useLanguage();

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('shokha_owner_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    if (password === OWNER_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('shokha_owner_auth', 'true');
    } else {
      alert(language === 'ar' ? 'كلمة المرور خاطئة' : language === 'he' ? 'סיסמה שגויה' : 'Wrong password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('shokha_owner_auth');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-zinc-900 border-2 border-[#FFD700]/50 rounded-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-[#FFD700]" />
          </div>
          <h1 className="text-2xl font-bold text-[#FFD700] text-center mb-6">
            {language === 'ar' ? 'لوحة تحكم المالك' : language === 'he' ? 'לוח בקרה של הבעלים' : 'Owner Dashboard'}
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full px-4 py-3 bg-black border-2 border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
            placeholder={language === 'ar' ? 'كلمة المرور' : language === 'he' ? 'סיסמה' : 'Password'}
          />
          <button
            onClick={handleLogin}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:from-[#C4A572] hover:to-[#FFD700] transition-all duration-300"
          >
            {language === 'ar' ? 'دخول' : language === 'he' ? 'כניסה' : 'Login'}
          </button>
        </div>
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