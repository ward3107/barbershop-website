import { useState, useEffect } from 'react';
import { Lock, LogOut, Trash2, CheckCircle, XCircle, Clock, Users, BarChart3, Image, Megaphone, Calendar, MessageCircle, DollarSign, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationManager from './NotificationManager';
import WhatsAppQuickSender from './WhatsAppQuickSender';
import { getAllBookings, updateBookingStatus, deleteBooking as deleteBookingFromDB, type Booking } from '@/services/bookingService';
import { sendApprovalToMake, sendRejectionToMake } from '@/services/makeWebhook';
import { useLanguage } from '@/contexts/LanguageContext';

type TabType = 'bookings' | 'customers' | 'analytics' | 'gallery' | 'announcements';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  const { language } = useLanguage();

  // Simple password (you can change this)
  const ADMIN_PASSWORD = 'shokha2025';

  // Translations
  const translations = {
    en: {
      adminTitle: 'SHOKHA Admin',
      enterPassword: 'Enter password to access dashboard',
      password: 'Enter password',
      login: 'Login',
      incorrectPassword: 'Incorrect password',
      dashboardTitle: 'SHOKHA Admin Dashboard',
      manageBusiness: 'Manage your business',
      logout: 'Logout',
      bookings: 'Bookings',
      customers: 'Customers',
      analytics: 'Analytics',
      gallery: 'Gallery',
      announcements: 'Announcements',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      completed: 'Completed',
      customer: 'Customer',
      phone: 'Phone',
      service: 'Service',
      dateTime: 'Date & Time',
      status: 'Status',
      actions: 'Actions',
      noBookings: 'No bookings yet',
      approve: 'Approve',
      reject: 'Reject',
      complete: 'Complete',
      delete: 'Delete',
      swipeMore: '← Swipe to see more →',
      at: 'at'
    },
    ar: {
      adminTitle: 'إدارة SHOKHA',
      enterPassword: 'أدخل كلمة المرور للوصول إلى لوحة التحكم',
      password: 'أدخل كلمة المرور',
      login: 'تسجيل الدخول',
      incorrectPassword: 'كلمة مرور غير صحيحة',
      dashboardTitle: 'لوحة تحكم SHOKHA',
      manageBusiness: 'إدارة عملك',
      logout: 'تسجيل الخروج',
      bookings: 'الحجوزات',
      customers: 'العملاء',
      analytics: 'التحليلات',
      gallery: 'المعرض',
      announcements: 'الإعلانات',
      pending: 'قيد الانتظار',
      approved: 'موافق عليه',
      rejected: 'مرفوض',
      completed: 'مكتمل',
      customer: 'العميل',
      phone: 'الهاتف',
      service: 'الخدمة',
      dateTime: 'التاريخ والوقت',
      status: 'الحالة',
      actions: 'الإجراءات',
      noBookings: 'لا توجد حجوزات بعد',
      approve: 'موافقة',
      reject: 'رفض',
      complete: 'إكمال',
      delete: 'حذف',
      swipeMore: '→ اسحب لرؤية المزيد ←',
      at: 'في'
    },
    he: {
      adminTitle: 'ניהול SHOKHA',
      enterPassword: 'הזן סיסמה לגישה ללוח הבקרה',
      password: 'הזן סיסמה',
      login: 'התחבר',
      incorrectPassword: 'סיסמה שגויה',
      dashboardTitle: 'לוח בקרה SHOKHA',
      manageBusiness: 'נהל את העסק שלך',
      logout: 'התנתק',
      bookings: 'הזמנות',
      customers: 'לקוחות',
      analytics: 'אנליטיקה',
      gallery: 'גלריה',
      announcements: 'הודעות',
      pending: 'ממתין',
      approved: 'אושר',
      rejected: 'נדחה',
      completed: 'הושלם',
      customer: 'לקוח',
      phone: 'טלפון',
      service: 'שירות',
      dateTime: 'תאריך ושעה',
      status: 'סטטוס',
      actions: 'פעולות',
      noBookings: 'אין הזמנות עדיין',
      approve: 'אשר',
      reject: 'דחה',
      complete: 'סיים',
      delete: 'מחק',
      swipeMore: '← החלק לראות עוד →',
      at: 'ב'
    }
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem('shokha_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadBookings();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
      const interval = setInterval(loadBookings, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      const allBookings = await getAllBookings();
      // Sort by date and time, newest first
      const sorted = allBookings.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) return dateB - dateA;
        return b.time.localeCompare(a.time);
      });
      setBookings(sorted);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('shokha_admin_auth', 'true');
      setError('');
      loadBookings();
    } else {
      setError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('shokha_admin_auth');
    setPassword('');
  };

  const handleApprove = async (booking: Booking) => {
    if (!booking.id) return;
    try {
      await updateBookingStatus(booking.id, 'approved');
      await sendApprovalToMake(booking);
      alert(`✅ Booking approved! WhatsApp confirmation sent to ${booking.customerPhone}`);
      loadBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      alert('Error approving booking');
    }
  };

  const handleReject = async (booking: Booking) => {
    if (!booking.id) return;
    if (confirm(`Are you sure you want to reject ${booking.customerName}'s booking?`)) {
      try {
        await updateBookingStatus(booking.id, 'rejected');
        await sendRejectionToMake(booking);
        alert(`❌ Booking rejected. WhatsApp notification sent to ${booking.customerPhone}`);
        loadBookings();
      } catch (error) {
        console.error('Error rejecting booking:', error);
        alert('Error rejecting booking');
      }
    }
  };

  const handleComplete = async (booking: Booking) => {
    if (!booking.id) return;
    if (confirm(`Mark ${booking.customerName}'s appointment as completed?`)) {
      try {
        await updateBookingStatus(booking.id, 'completed');
        alert(`✅ Appointment marked as completed! Loyalty points awarded.`);
        loadBookings();
      } catch (error) {
        console.error('Error completing booking:', error);
        alert('Error completing booking');
      }
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBookingFromDB(id);
        alert('Booking deleted');
        loadBookings();
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-500"><Clock className="w-4 h-4" /> {t.pending}</span>;
      case 'approved':
        return <span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-4 h-4" /> {t.approved}</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4" /> {t.rejected}</span>;
      case 'completed':
        return <span className="flex items-center gap-1 text-blue-500"><CheckCircle className="w-4 h-4" /> {t.completed}</span>;
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-[#FFD700]">{t.adminTitle}</h1>
            <p className="text-gray-400 mt-2">{t.enterPassword}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.password}
                  className="w-full px-4 py-3 pr-12 bg-black border border-[#C4A572] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FFD700] transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{t.incorrectPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
            >
              {t.login}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'bookings' as TabType, label: t.bookings, icon: Calendar },
    { id: 'customers' as TabType, label: t.customers, icon: Users },
    { id: 'analytics' as TabType, label: t.analytics, icon: BarChart3 },
    { id: 'gallery' as TabType, label: t.gallery, icon: Image },
    { id: 'announcements' as TabType, label: t.announcements, icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#FFD700]">{t.dashboardTitle}</h1>
            <p className="text-gray-400 mt-2">{t.manageBusiness}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t.logout}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap gap-2 bg-zinc-900 p-2 rounded-xl border border-[#FFD700]/20">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' && (
        <>
          {/* Stats */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">{t.pending}</p>
              <p className="text-2xl font-bold text-yellow-500">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">{t.approved}</p>
              <p className="text-2xl font-bold text-green-500">{bookings.filter(b => b.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-gray-400 text-sm">{t.rejected}</p>
              <p className="text-2xl font-bold text-red-500">{bookings.filter(b => b.status === 'rejected').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="max-w-7xl mx-auto bg-zinc-900 border-2 border-[#FFD700] rounded-2xl overflow-hidden">
        {/* Mobile scroll hint */}
        <div className="md:hidden bg-black/50 px-4 py-2 text-xs text-[#FFD700] text-center border-b border-[#FFD700]/20">
          {t.swipeMore}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-black border-b border-[#C4A572]">
              <tr>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">{t.customer}</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">{t.phone}</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">{t.service}</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">{t.dateTime}</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">{t.status}</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    {t.noBookings}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="px-4 py-3">{booking.customerName}</td>
                    <td className="px-4 py-3">{booking.customerPhone}</td>
                    <td className="px-4 py-3">{booking.service}</td>
                    <td className="px-4 py-3">
                      {booking.date.toLocaleDateString()} {t.at} {booking.time}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(booking)}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-semibold"
                            >
                              {t.approve}
                            </button>
                            <button
                              onClick={() => handleReject(booking)}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                            >
                              {t.reject}
                            </button>
                          </>
                        )}
                        {booking.status === 'approved' && (
                          <button
                            onClick={() => handleComplete(booking)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
                          >
                            {t.complete}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title={t.delete}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div className="max-w-7xl mx-auto">
          <CustomersSection bookings={bookings} />
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto">
          <AnalyticsSection bookings={bookings} />
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="max-w-7xl mx-auto">
          <GallerySection />
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="max-w-7xl mx-auto">
          <AnnouncementsSection />
        </div>
      )}

      {/* Admin Tools */}
      <NotificationManager />
      <WhatsAppQuickSender />

      {/* Smooth scrolling styles for tables */}
      <style>{`
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: #FFD700 #1a1a1a;
        }
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #FFD700;
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: #C4A572;
        }
      `}</style>
    </div>
  );
}

// Customers Section Component
function CustomersSection({ bookings }: { bookings: Booking[] }) {
  // Group bookings by customer
  const customerMap = new Map<string, {
    name: string;
    phone: string;
    email?: string;
    bookings: Booking[];
    totalBookings: number;
    completedBookings: number;
    noShows: number;
    lastVisit?: Date;
  }>();

  bookings.forEach(booking => {
    const key = booking.customerPhone;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: booking.customerName,
        phone: booking.customerPhone,
        email: booking.customerEmail,
        bookings: [],
        totalBookings: 0,
        completedBookings: 0,
        noShows: 0,
      });
    }
    const customer = customerMap.get(key)!;
    customer.bookings.push(booking);
    customer.totalBookings++;
    if (booking.status === 'completed') {
      customer.completedBookings++;
      if (!customer.lastVisit || booking.date > customer.lastVisit) {
        customer.lastVisit = booking.date;
      }
    }
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => b.totalBookings - a.totalBookings);

  return (
    <div className="space-y-6">
      {/* Customer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#FFD700]" />
            <div>
              <p className="text-gray-400 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-[#FFD700]">{customers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Repeat Customers</p>
              <p className="text-2xl font-bold text-green-500">
                {customers.filter(c => c.totalBookings > 1).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-gray-400 text-sm">Avg Bookings/Customer</p>
              <p className="text-2xl font-bold text-blue-500">
                {customers.length > 0 ? (bookings.length / customers.length).toFixed(1) : 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-gray-400 text-sm">VIP Customers (5+)</p>
              <p className="text-2xl font-bold text-purple-500">
                {customers.filter(c => c.totalBookings >= 5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl overflow-hidden">
        {/* Mobile scroll hint */}
        <div className="md:hidden bg-black/50 px-4 py-2 text-xs text-[#FFD700] text-center border-b border-[#FFD700]/20">
          ← Swipe to see more →
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-black border-b border-[#C4A572]">
              <tr>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Customer</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Contact</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Total Visits</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Completed</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Last Visit</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No customers yet
                  </td>
                </tr>
              ) : (
                customers.map((customer, index) => (
                  <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#FFD700]" />
                        </div>
                        <div>
                          <p className="font-semibold">{customer.name}</p>
                          {customer.totalBookings >= 5 && (
                            <span className="text-xs text-purple-400">VIP Customer</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="text-gray-300">{customer.phone}</p>
                        {customer.email && <p className="text-gray-500">{customer.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-[#FFD700]">{customer.totalBookings}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-green-500 font-semibold">{customer.completedBookings}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-400">
                        {customer.lastVisit ? customer.lastVisit.toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-semibold w-fit"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Analytics Section Component
function AnalyticsSection({ bookings }: { bookings: Booking[] }) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedBookings = bookings.filter(b => b.status === 'completed');

  // Count bookings by period
  const dailyBookings = completedBookings.filter(b => b.date >= startOfToday).length;
  const weeklyBookings = completedBookings.filter(b => b.date >= startOfWeek).length;
  const monthlyBookings = completedBookings.filter(b => b.date >= startOfMonth).length;

  // Popular services
  const serviceCount: Record<string, number> = {};
  completedBookings.forEach(b => {
    serviceCount[b.service] = (serviceCount[b.service] || 0) + 1;
  });
  const popularServices = Object.entries(serviceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Busiest times
  const timeSlots: Record<string, number> = {};
  completedBookings.forEach(b => {
    const hour = parseInt(b.time.split(':')[0]);
    const timeSlot = `${hour}:00`;
    timeSlots[timeSlot] = (timeSlots[timeSlot] || 0) + 1;
  });
  const busiestTimes = Object.entries(timeSlots)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Booking Stats */}
      <div>
        <h2 className="text-2xl font-bold text-[#FFD700] mb-4">Booking Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-gray-400 text-sm">Today's Completed</p>
                <p className="text-2xl font-bold text-green-500">{dailyBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-blue-500">{weeklyBookings}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-900 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-gray-400 text-sm">This Month</p>
                <p className="text-2xl font-bold text-purple-500">{monthlyBookings}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Services */}
      <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Popular Services
        </h2>
        <div className="space-y-3">
          {popularServices.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data available yet</p>
          ) : (
            popularServices.map(([service, count], index) => (
              <div key={service} className="flex items-center justify-between p-3 bg-black rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-[#FFD700]">#{index + 1}</span>
                  <span className="text-white font-semibold">{service}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#FFD700] to-[#C4A572] h-2 rounded-full"
                      style={{ width: `${(count / popularServices[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-[#FFD700] font-bold w-12 text-right">{count}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Busiest Times */}
      <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-[#FFD700] mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6" />
          Busiest Times
        </h2>
        <div className="space-y-3">
          {busiestTimes.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No data available yet</p>
          ) : (
            busiestTimes.map(([time, count], index) => (
              <div key={time} className="flex items-center justify-between p-3 bg-black rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-500">#{index + 1}</span>
                  <span className="text-white font-semibold">{time}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-48 bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / busiestTimes[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-blue-500 font-bold w-12 text-right">{count} bookings</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Business Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#FFD700] mb-2">Total Completed Services</h3>
          <p className="text-3xl font-bold text-white">{completedBookings.length}</p>
        </div>
        <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#FFD700] mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-white">{bookings.length}</p>
        </div>
      </div>
    </div>
  );
}

// Gallery Section Component
function GallerySection() {
  const [images, setImages] = useState<Array<{ id: string; url: string; storagePath: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const { getGalleryImages } = await import('@/services/galleryService');
      const galleryImages = await getGalleryImages();
      setImages(galleryImages);
    } catch (error) {
      console.error('Error loading gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const { uploadGalleryImage } = await import('@/services/galleryService');

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          await uploadGalleryImage(file);
        }
      }

      alert('Images uploaded successfully!');
      loadGalleryImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDelete = async (imageId: string, storagePath: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { deleteGalleryImage } = await import('@/services/galleryService');
      await deleteGalleryImage(imageId, storagePath);
      alert('Image deleted successfully!');
      loadGalleryImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#FFD700] flex items-center gap-2">
            <Image className="w-6 h-6" />
            Gallery Manager
          </h2>
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg flex items-center gap-2 ${
                uploading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-[#FFD700]/50'
              }`}
            >
              <Image className="w-5 h-5" />
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </motion.div>
          </label>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading gallery...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No photos yet</p>
            <p className="text-sm text-gray-500">Upload your first photo to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group aspect-square rounded-lg overflow-hidden bg-zinc-800"
              >
                <img
                  src={image.url}
                  alt="Gallery"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(image.id, image.storagePath)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-[#FFD700] mb-2">Gallery Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Photos</p>
            <p className="text-2xl font-bold text-white">{images.length}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Storage Used</p>
            <p className="text-2xl font-bold text-white">
              {((images.length * 0.5)).toFixed(1)} MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Announcements Section Component
function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Array<{
    id?: string;
    textEn: string;
    textAr: string;
    textHe: string;
    type: 'hot' | 'exclusive' | 'limited' | 'vip';
    iconName: string;
    active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    textEn: '',
    textAr: '',
    textHe: '',
    type: 'hot' as 'hot' | 'exclusive' | 'limited' | 'vip',
    iconName: 'Star',
    active: true
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const { getAnnouncements, initializeDefaultAnnouncements } = await import('@/services/announcementsService');
      await initializeDefaultAnnouncements(); // Initialize defaults if needed
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: typeof announcements[0]) => {
    setEditingId(announcement.id || null);
    setFormData({
      textEn: announcement.textEn,
      textAr: announcement.textAr,
      textHe: announcement.textHe,
      type: announcement.type,
      iconName: announcement.iconName,
      active: announcement.active
    });
  };

  const handleSave = async () => {
    try {
      const { updateAnnouncement, createAnnouncement } = await import('@/services/announcementsService');

      if (editingId) {
        await updateAnnouncement(editingId, formData);
        alert('Announcement updated successfully!');
      } else {
        await createAnnouncement(formData);
        alert('Announcement created successfully!');
      }

      setEditingId(null);
      setFormData({
        textEn: '',
        textAr: '',
        textHe: '',
        type: 'hot',
        iconName: 'Star',
        active: true
      });
      loadAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error saving announcement');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const { deleteAnnouncement } = await import('@/services/announcementsService');
      await deleteAnnouncement(id);
      alert('Announcement deleted successfully!');
      loadAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Error deleting announcement');
    }
  };

  const iconOptions = ['Star', 'Crown', 'Diamond', 'Gift', 'Award'];
  const typeOptions: Array<'hot' | 'exclusive' | 'limited' | 'vip'> = ['hot', 'exclusive', 'limited', 'vip'];

  return (
    <div className="space-y-6">
      {/* Editor Form */}
      <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-[#FFD700] mb-6 flex items-center gap-2">
          <Megaphone className="w-6 h-6" />
          {editingId ? 'Edit Announcement' : 'Create New Announcement'}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as typeof formData.type })}
                className="w-full px-4 py-2 bg-black border border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Icon</label>
              <select
                value={formData.iconName}
                onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                className="w-full px-4 py-2 bg-black border border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">English Text</label>
            <input
              type="text"
              value={formData.textEn}
              onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
              placeholder="Enter English text"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Arabic Text</label>
            <input
              type="text"
              value={formData.textAr}
              onChange={(e) => setFormData({ ...formData, textAr: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
              placeholder="أدخل النص بالعربية"
              dir="rtl"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Hebrew Text</label>
            <input
              type="text"
              value={formData.textHe}
              onChange={(e) => setFormData({ ...formData, textHe: e.target.value })}
              className="w-full px-4 py-2 bg-black border border-[#FFD700]/30 rounded-lg text-white focus:border-[#FFD700] focus:outline-none"
              placeholder="הזן טקסט בעברית"
              dir="rtl"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5"
            />
            <label className="text-gray-300 text-sm font-medium">Active (show on website)</label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
            >
              {editingId ? 'Update' : 'Create'} Announcement
            </button>
            {editingId && (
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    textEn: '',
                    textAr: '',
                    textHe: '',
                    type: 'hot',
                    iconName: 'Star',
                    active: true
                  });
                }}
                className="px-6 py-3 bg-zinc-700 text-white font-bold rounded-lg hover:bg-zinc-600 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-zinc-900 border-2 border-[#FFD700] rounded-2xl p-6">
        <h3 className="text-xl font-bold text-[#FFD700] mb-4">Current Announcements</h3>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No announcements yet</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="bg-black rounded-lg p-4 border border-[#FFD700]/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        announcement.type === 'vip' ? 'bg-[#FFD700] text-black' :
                        announcement.type === 'hot' ? 'bg-red-500 text-white' :
                        announcement.type === 'exclusive' ? 'bg-purple-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {announcement.type.toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-xs">{announcement.iconName}</span>
                      {announcement.active && (
                        <span className="text-green-500 text-xs">● Active</span>
                      )}
                    </div>
                    <p className="text-white font-semibold mb-1">{announcement.textEn}</p>
                    <p className="text-gray-400 text-sm" dir="rtl">{announcement.textAr}</p>
                    <p className="text-gray-400 text-sm" dir="rtl">{announcement.textHe}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => announcement.id && handleDelete(announcement.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
