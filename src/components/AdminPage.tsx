import { useState, useEffect } from 'react';
import { Lock, LogOut, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationManager from './NotificationManager';
import WhatsAppQuickSender from './WhatsAppQuickSender';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: Date;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState('');

  // Simple password (you can change this)
  const ADMIN_PASSWORD = 'shokha2025';

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

  const deleteBooking = (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      const updated = bookings.filter(b => b.id !== id);
      localStorage.setItem('shokha_bookings', JSON.stringify(updated));
      setBookings(updated);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 text-yellow-500"><Clock className="w-4 h-4" /> Pending</span>;
      case 'approved':
        return <span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-4 h-4" /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4" /> Rejected</span>;
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
            <h1 className="text-3xl font-bold text-[#FFD700]">SHOKHA Admin</h1>
            <p className="text-gray-400 mt-2">Enter password to access dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-black border border-[#C4A572] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#FFD700]/50 transition-all"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#FFD700]">SHOKHA Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Manage your bookings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-zinc-900 border border-yellow-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-500">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-500">{bookings.filter(b => b.status === 'approved').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-2xl font-bold text-red-500">{bookings.filter(b => b.status === 'rejected').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="max-w-7xl mx-auto bg-zinc-900 border-2 border-[#FFD700] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black border-b border-[#C4A572]">
              <tr>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Customer</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Phone</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Service</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Date & Time</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Status</th>
                <th className="px-4 py-3 text-left text-[#FFD700] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                    <td className="px-4 py-3">{booking.customerName}</td>
                    <td className="px-4 py-3">{booking.customerPhone}</td>
                    <td className="px-4 py-3">{booking.service}</td>
                    <td className="px-4 py-3">
                      {booking.date.toLocaleDateString()} at {booking.time}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(booking.status)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Tools */}
      <NotificationManager />
      <WhatsAppQuickSender />
    </div>
  );
}
