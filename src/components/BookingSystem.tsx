import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, User, CheckCircle, XCircle,
  AlertCircle, Bell, MessageSquare, Scissors
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { sendCustomerApproval, sendCustomerRejection } from '@/services/twilioService';

// Types
interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: Date;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  notes?: string;
}

interface BookingSystemProps {
  isOwner?: boolean;
}

// Mock database - in production, this would be a real backend
const MOCK_BOOKINGS_KEY = 'shokha_bookings';

export default function BookingSystem({ isOwner = false }: BookingSystemProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const { language } = useLanguage();

  // Load bookings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(MOCK_BOOKINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setBookings(parsed.map((b: any) => ({
        ...b,
        date: new Date(b.date),
        createdAt: new Date(b.createdAt)
      })));
    }
  }, []);

  // Save bookings to localStorage
  const saveBookings = (newBookings: Booking[]) => {
    localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  // Handle owner actions
  const handleApprove = (bookingId: string) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'approved' as const } : b
    );
    saveBookings(updated);

    // Send notification to customer (mock)
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      sendCustomerNotification(booking, 'approved');
    }
  };

  const handleReject = (bookingId: string) => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status: 'rejected' as const } : b
    );
    saveBookings(updated);

    // Send notification to customer (mock)
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      sendCustomerNotification(booking, 'rejected');
    }
  };

  // Automatic WhatsApp notification system using Twilio
  const sendCustomerNotification = async (booking: Booking, status: 'approved' | 'rejected') => {
    console.log(`📱 Sending WhatsApp notification to ${booking.customerPhone}`);

    try {
      if (status === 'approved') {
        const success = await sendCustomerApproval(booking);
        if (success) {
          alert(`✅ WhatsApp sent to ${booking.customerName}!\n\nApproval message sent automatically via Twilio.`);
        } else {
          alert(`⚠️ Failed to send WhatsApp. Check your Twilio configuration.`);
        }
      } else {
        const success = await sendCustomerRejection(booking);
        if (success) {
          alert(`✅ WhatsApp sent to ${booking.customerName}!\n\nRejection message sent automatically via Twilio.`);
        } else {
          alert(`⚠️ Failed to send WhatsApp. Check your Twilio configuration.`);
        }
      }
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Failed to send WhatsApp'}`);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(b =>
    filter === 'all' || b.status === filter
  );

  const texts = {
    ar: {
      title: isOwner ? 'إدارة الحجوزات' : 'حجوزاتي',
      pending: 'في الانتظار',
      approved: 'مؤكد',
      rejected: 'مرفوض',
      approve: 'موافقة',
      reject: 'رفض',
      customer: 'العميل',
      service: 'الخدمة',
      dateTime: 'التاريخ والوقت',
      status: 'الحالة',
      actions: 'الإجراءات',
      noBookings: 'لا توجد حجوزات',
      sendMessage: 'إرسال رسالة',
      addToCalendar: 'إضافة للتقويم',
      waitingApproval: 'في انتظار موافقة المالك',
      bookingConfirmed: 'الحجز مؤكد - يمكنك إضافته للتقويم'
    },
    en: {
      title: isOwner ? 'Booking Management' : 'My Bookings',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      approve: 'Approve',
      reject: 'Reject',
      customer: 'Customer',
      service: 'Service',
      dateTime: 'Date & Time',
      status: 'Status',
      actions: 'Actions',
      noBookings: 'No bookings found',
      sendMessage: 'Send Message',
      addToCalendar: 'Add to Calendar',
      waitingApproval: 'Waiting for owner approval',
      bookingConfirmed: 'Booking confirmed - Add to your calendar'
    },
    he: {
      title: isOwner ? 'ניהול הזמנות' : 'ההזמנות שלי',
      pending: 'ממתין',
      approved: 'אושר',
      rejected: 'נדחה',
      approve: 'אשר',
      reject: 'דחה',
      customer: 'לקוח',
      service: 'שירות',
      dateTime: 'תאריך ושעה',
      status: 'סטטוס',
      actions: 'פעולות',
      noBookings: 'אין הזמנות',
      sendMessage: 'שלח הודעה',
      addToCalendar: 'הוסף ליומן',
      waitingApproval: 'ממתין לאישור הבעלים',
      bookingConfirmed: 'ההזמנה אושרה - הוסף ליומן'
    }
  };

  const t = texts[language as keyof typeof texts];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'approved': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return '';
    }
  };

  // Generate calendar event
  const generateCalendarEvent = (booking: Booking) => {
    const startDate = new Date(booking.date);
    const [hours, minutes] = booking.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes));

    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 40); // 40 min appointment

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:SHOKHA Barber - ${booking.service}
DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
LOCATION:SHOKHA BARBER SHOP, Kfar Yassif
DESCRIPTION:Appointment confirmed at SHOKHA BARBER SHOP
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shokha-appointment-${booking.id}.ics`;
    link.click();
  };

  return (
    <div className="bg-black rounded-xl border border-[#FFD700]/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#FFD700]">{t.title}</h2>
        <Bell className="w-6 h-6 text-[#FFD700]" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === f
                ? 'bg-[#FFD700] text-black'
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            }`}
          >
            {t[f as keyof typeof t] || f}
            {f !== 'all' && (
              <span className="ml-2 text-xs">
                ({bookings.filter(b => b.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 rounded-lg border border-[#FFD700]/20 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Customer Info */}
                    <div className="flex items-center gap-3 mb-3">
                      <User className="w-5 h-5 text-[#C4A572]" />
                      <div>
                        <p className="text-white font-semibold">{booking.customerName}</p>
                        <p className="text-gray-400 text-sm">{booking.customerPhone}</p>
                      </div>
                    </div>

                    {/* Service & Time */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-4 h-4 text-[#C4A572]" />
                        <span className="text-gray-300 text-sm">{booking.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#C4A572]" />
                        <span className="text-gray-300 text-sm">
                          {booking.date.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#C4A572]" />
                        <span className="text-gray-300 text-sm">{booking.time}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {t[booking.status as keyof typeof t]}
                      </span>
                      {booking.status === 'pending' && !isOwner && (
                        <span className="text-xs text-gray-400">
                          {t.waitingApproval}
                        </span>
                      )}
                      {booking.status === 'approved' && !isOwner && (
                        <span className="text-xs text-green-400">
                          {t.bookingConfirmed}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {isOwner && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(booking.id)}
                          className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {t.approve}
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          {t.reject}
                        </button>
                      </>
                    )}

                    {isOwner && (
                      <button className="px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/30 transition-all flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {t.sendMessage}
                      </button>
                    )}

                    {!isOwner && booking.status === 'approved' && (
                      <button
                        onClick={() => generateCalendarEvent(booking)}
                        className="px-4 py-2 bg-[#FFD700]/20 text-[#FFD700] rounded-lg hover:bg-[#FFD700]/30 transition-all flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        {t.addToCalendar}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t.noBookings}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Export function to create a new booking
export async function createBooking(
  customerName: string,
  customerPhone: string,
  service: string,
  date: Date,
  time: string,
  customerEmail?: string
): Promise<Booking> {
  // Use crypto.randomUUID() for secure, unpredictable booking IDs
  const booking: Booking = {
    id: crypto.randomUUID(),
    customerName,
    customerPhone,
    customerEmail,
    service,
    date,
    time,
    status: 'pending',
    createdAt: new Date()
  };

  // Save to localStorage
  const stored = localStorage.getItem(MOCK_BOOKINGS_KEY);
  const bookings = stored ? JSON.parse(stored) : [];
  bookings.push(booking);
  localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));

  // Send notification to owner
  try {
    const message = `
🔔 *New Booking Request*
👤 Customer: ${booking.customerName}
📱 Phone: ${booking.customerPhone}
✂️ Service: ${booking.service}
📅 Date: ${booking.date.toLocaleDateString()}
⏰ Time: ${booking.time}

Click here to approve/reject:
${window.location.origin}/admin
    `.trim();

    // Method 1: WhatsApp Web (opens but needs manual send)
    const ownerWhatsapp = import.meta.env.VITE_OWNER_WHATSAPP || '';
    const whatsappUrl = `https://wa.me/${ownerWhatsapp}?text=${encodeURIComponent(message)}`;

    // Method 2: Browser notification (if permission granted)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Booking - SHOKHA', {
        body: `${booking.customerName} - ${booking.service} at ${booking.time}`,
        icon: '/logo.png',
        tag: booking.id
      });
    }

    // Method 3: Store notification for dashboard alert
    const notifications = JSON.parse(localStorage.getItem('pending_notifications') || '[]');
    notifications.push({
      id: booking.id,
      message: `New booking from ${booking.customerName}`,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('pending_notifications', JSON.stringify(notifications));

    // Open WhatsApp (user must click send)
    console.log('📱 Opening WhatsApp - YOU MUST CLICK SEND IN WHATSAPP!');
    window.open(whatsappUrl, '_blank');

    // Show alert to remind user
    alert(`⚠️ IMPORTANT:\n\n1. WhatsApp Web has opened\n2. YOU MUST CLICK "SEND" to receive the message\n3. Or check the Owner Dashboard at /admin\n\nWhatsApp doesn't auto-send for security reasons.`);

  } catch (error) {
    console.error('Failed to send notification:', error);
  }

  console.log('📱 New booking request:', booking);

  return booking;
}