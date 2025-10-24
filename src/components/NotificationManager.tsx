import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bell, BellRing, Volume2, VolumeX, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// In-page alert component (prevents XSS by using React rendering)
interface InPageAlertProps {
  booking: any;
  onClose: () => void;
}

function InPageAlert({ booking, onClose }: InPageAlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 10000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed top-20 right-4 z-50 max-w-md"
    >
      <div className="bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black p-4 rounded-xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔔</div>
          <div className="flex-1">
            <div className="font-bold text-lg">New Booking!</div>
            {/* Safe: React automatically escapes these values */}
            <div>{booking.customerName} - {booking.service}</div>
            <div className="text-sm opacity-80">{booking.customerPhone} at {booking.time}</div>
          </div>
        </div>
        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center bg-black text-[#FFD700] py-2 rounded-lg font-bold hover:bg-zinc-900 transition-colors"
        >
          Open Dashboard
        </a>
      </div>
    </motion.div>,
    document.body
  );
}

export default function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastBookingId, setLastBookingId] = useState('');
  const [activeAlert, setActiveAlert] = useState<any>(null);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Check for new bookings every 5 seconds
    const interval = setInterval(checkForNewBookings, 5000);
    return () => clearInterval(interval);
  }, [lastBookingId]);

  const checkForNewBookings = () => {
    const bookings = JSON.parse(localStorage.getItem('shokha_bookings') || '[]');
    if (bookings.length > 0) {
      const latestBooking = bookings[bookings.length - 1];

      // Check if this is a new booking we haven't notified about
      if (latestBooking.id !== lastBookingId && latestBooking.status === 'pending') {
        setLastBookingId(latestBooking.id);
        showNotification(latestBooking);
        if (soundEnabled) {
          playNotificationSound();
        }
      }
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        new Notification('Notifications Enabled! 🎉', {
          body: 'You will now receive booking alerts automatically.',
          icon: '/logo.png'
        });
      }
    }
  };

  const showNotification = (booking: any) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('🔔 New Booking - SHOKHA', {
        body: `${booking.customerName} - ${booking.service}\n📱 ${booking.customerPhone}\n⏰ ${booking.time}`,
        icon: '/logo.png',
        tag: booking.id,
        requireInteraction: true // Keeps notification visible
      });

      // Click on notification opens dashboard
      notification.onclick = () => {
        window.open('/admin', '_blank');
        notification.close();
      };
    }

    // Show in-page alert using React component (XSS-safe)
    setActiveAlert(booking);
  };

  const playNotificationSound = () => {
    // Create notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Second beep
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 1000;
      osc2.type = 'sine';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.3);
    }, 200);
  };

  return (
    <>
      {/* Hide on mobile devices (md: medium screens and up) */}
      <div className="hidden md:block fixed bottom-4 left-4 z-40">
        {/* Notification Permission Button */}
        {permission !== 'granted' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={requestPermission}
            className="bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-2xl hover:shadow-[#FFD700]/50 transition-all"
          >
            <Bell className="w-5 h-5" />
            Enable Notifications
          </motion.button>
        )}

        {/* Sound Toggle */}
        {permission === 'granted' && (
          <div className="flex gap-2">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${
                soundEnabled ? 'bg-green-500' : 'bg-red-500'
              } text-white p-3 rounded-full shadow-lg transition-colors`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </motion.button>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-black border-2 border-[#FFD700] text-[#FFD700] px-4 py-3 rounded-full flex items-center gap-2"
            >
              <BellRing className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-bold">Live Monitoring</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* In-page alert (XSS-safe using React Portal) */}
      <AnimatePresence>
        {activeAlert && (
          <InPageAlert
            booking={activeAlert}
            onClose={() => setActiveAlert(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}