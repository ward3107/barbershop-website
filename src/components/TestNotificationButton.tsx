import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';

export default function TestNotificationButton() {
  const handleTestNotification = () => {
    console.log('🧪 Testing WhatsApp notification directly...');

    // Create test booking
    const testBooking = {
      customerName: 'Test Customer',
      customerPhone: '0501234567',
      service: 'Haircut Test',
      date: new Date().toLocaleDateString(),
      time: '14:00'
    };

    // Build WhatsApp message
    const message = `
🔔 *New Booking Request*
👤 Customer: ${testBooking.customerName}
📱 Phone: ${testBooking.customerPhone}
✂️ Service: ${testBooking.service}
📅 Date: ${testBooking.date}
⏰ Time: ${testBooking.time}

Click here to approve/reject:
${window.location.origin}/admin
    `.trim();

    // Your WhatsApp number (without +)
    const ownerWhatsapp = import.meta.env.VITE_OWNER_WHATSAPP || '';
    const whatsappUrl = `https://wa.me/${ownerWhatsapp}?text=${encodeURIComponent(message)}`;

    console.log('📱 Opening WhatsApp with URL:', whatsappUrl);
    console.log('📞 Sending to number:', ownerWhatsapp);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');

    console.log('✅ WhatsApp should have opened in a new tab!');
    alert('WhatsApp should have opened!\n\nIf not:\n1. Allow popups for this site\n2. Check your browser\'s address bar for blocked popup icon');
  };

  return (
    <motion.button
      onClick={handleTestNotification}
      className="fixed bottom-4 left-4 z-50 bg-green-500 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-green-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageSquare className="w-5 h-5" />
      Test WhatsApp Notification
      <Send className="w-4 h-4" />
    </motion.button>
  );
}