import { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export default function EmailNotificationSetup() {
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEmail = () => {
    if (email) {
      localStorage.setItem('owner_email', email);
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 2000);
    }
  };

  const sendTestEmail = () => {
    const savedEmail = localStorage.getItem('owner_email');
    if (savedEmail) {
      // Create mailto link as fallback
      const subject = 'New Booking - SHOKHA Barbershop';
      const body = `
New booking received!

Customer: Test Customer
Phone: 0501234567
Service: Haircut
Date: ${new Date().toLocaleDateString()}
Time: 14:00

Login to approve: ${window.location.origin}/admin
      `.trim();

      const mailtoLink = `mailto:${savedEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;
    }
  };

  return (
    <div className="fixed bottom-20 right-4 bg-black border-2 border-[#FFD700] rounded-xl p-4 z-40">
      <h3 className="text-[#FFD700] font-bold mb-2 flex items-center gap-2">
        <Mail className="w-5 h-5" />
        Email Notifications
      </h3>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your-email@gmail.com"
        className="w-full px-3 py-2 bg-zinc-900 border border-[#FFD700]/30 rounded-lg text-white mb-2"
      />
      <div className="flex gap-2">
        <button
          onClick={handleSaveEmail}
          className="flex-1 px-3 py-2 bg-[#FFD700] text-black rounded-lg font-bold hover:bg-[#C4A572] transition-colors"
        >
          {isSaving ? <Check className="w-4 h-4 mx-auto" /> : 'Save'}
        </button>
        <button
          onClick={sendTestEmail}
          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Test
        </button>
      </div>
    </div>
  );
}