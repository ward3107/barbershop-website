import { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle, XCircle, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Booking } from '@/types';

export default function WhatsAppQuickSender() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    loadBookings();
    // Refresh every 5 seconds
    const interval = setInterval(loadBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadBookings = () => {
    const stored = localStorage.getItem('shokha_bookings');
    if (stored) {
      const parsed = JSON.parse(stored);
      setBookings(parsed.map((b: any) => ({
        ...b,
        date: new Date(b.date)
      })));
    }
  };

  const sendOwnerNotification = (booking: Booking) => {
    const message = `
🔔 *حجز جديد - New Booking*
👤 ${booking.customerName}
📱 ${booking.customerPhone}
✂️ ${booking.service}
📅 ${booking.date.toLocaleDateString()}
⏰ ${booking.time}

للموافقة/الرفض:
${window.location.origin}/admin
    `.trim();

    const ownerWhatsapp = import.meta.env.VITE_OWNER_WHATSAPP || '';
    const whatsappUrl = `https://wa.me/${ownerWhatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendCustomerApproval = (booking: Booking) => {
    // Format phone number (remove 0 and add 972)
    let customerPhone = booking.customerPhone.replace(/\D/g, '');
    if (customerPhone.startsWith('0')) {
      customerPhone = '972' + customerPhone.substring(1);
    }

    const message = `
✅ *موعدك مؤكد - Appointment Confirmed*

مرحباً ${booking.customerName}!

تم تأكيد موعدك:
📅 ${booking.date.toLocaleDateString()}
⏰ ${booking.time}
✂️ ${booking.service}

📍 SHOKHA BARBERSHOP
كفر ياسيف

نراك قريباً!
See you soon!
    `.trim();

    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Update booking status
    updateBookingStatus(booking.id, 'approved');
  };

  const sendCustomerRejection = (booking: Booking) => {
    // Format phone number
    let customerPhone = booking.customerPhone.replace(/\D/g, '');
    if (customerPhone.startsWith('0')) {
      customerPhone = '972' + customerPhone.substring(1);
    }

    const message = `
❌ *عذراً - Appointment Unavailable*

${booking.customerName} عزيزي

للأسف الموعد المطلوب غير متاح:
📅 ${booking.date.toLocaleDateString()}
⏰ ${booking.time}

يرجى اختيار موعد آخر:
${window.location.origin}

شكراً لتفهمك
SHOKHA BARBERSHOP
    `.trim();

    const whatsappUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Update booking status
    updateBookingStatus(booking.id, 'rejected');
  };

  const updateBookingStatus = (bookingId: string, status: 'approved' | 'rejected') => {
    const updated = bookings.map(b =>
      b.id === bookingId ? { ...b, status } : b
    );
    localStorage.setItem('shokha_bookings', JSON.stringify(updated));
    setBookings(updated);
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');

  return (
    <>
      {/* Floating Button with Counter */}
      <motion.button
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-24 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-2xl z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-6 h-6" />
        {pendingBookings.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
            {pendingBookings.length}
          </span>
        )}
      </motion.button>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-2 md:right-4 bottom-40 bg-black border-2 border-[#FFD700] rounded-2xl p-3 md:p-4 z-40 w-[calc(100vw-1rem)] sm:w-96 max-h-[60vh] md:max-h-[500px] overflow-y-auto"
          >
            <h3 className="text-[#FFD700] font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
              WhatsApp Quick Actions
            </h3>

            {pendingBookings.length === 0 ? (
              <p className="text-gray-400">No pending bookings</p>
            ) : (
              <div className="space-y-3">
                {pendingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-zinc-900 border border-[#FFD700]/30 rounded-xl p-2 md:p-3"
                  >
                    {/* Booking Info */}
                    <div className="mb-2 md:mb-3">
                      <div className="font-bold text-white text-sm md:text-base">{booking.customerName}</div>
                      <div className="text-xs md:text-sm text-gray-400">
                        <Phone className="inline w-3 h-3 mr-1" />
                        {booking.customerPhone}
                      </div>
                      <div className="text-xs md:text-sm text-[#FFD700]">{booking.service}</div>
                      <div className="text-xs text-gray-500">
                        {booking.date.toLocaleDateString()} at {booking.time}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      {/* Notify Owner */}
                      <button
                        onClick={() => sendOwnerNotification(booking)}
                        className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-blue-600 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 md:gap-2"
                      >
                        <Send className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Send to Owner (You)</span>
                        <span className="sm:hidden">Owner</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        {/* Approve & Send to Customer */}
                        <button
                          onClick={() => sendCustomerApproval(booking)}
                          className="px-2 md:px-3 py-1.5 md:py-2 bg-green-600 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                          Approve
                        </button>

                        {/* Reject & Send to Customer */}
                        <button
                          onClick={() => sendCustomerRejection(booking)}
                          className="px-2 md:px-3 py-1.5 md:py-2 bg-red-600 text-white rounded-lg text-xs md:text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="mt-3 md:mt-4 p-2 md:p-3 bg-zinc-900 rounded-lg">
              <p className="text-[10px] md:text-xs text-gray-400">
                <strong className="text-[#FFD700]">How it works:</strong><br />
                1. Click "Owner" → WhatsApp opens → Send<br />
                2. Click "Approve" → Customer WhatsApp → Send<br />
                3. Status updates automatically
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}