// Twilio WhatsApp Service
// This service sends automatic WhatsApp messages using Twilio API

interface TwilioConfig {
  accountSid: string;
  authToken: string;
  whatsappNumber: string; // Your Twilio WhatsApp number (e.g., 'whatsapp:+14155238886')
}

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  date: Date;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ⚠️ SECURITY WARNING: These credentials should be moved to a backend service!
// Never expose Twilio auth tokens in client-side code in production.
// This is a temporary solution for development only.
// For production, create a backend API endpoint that handles Twilio calls securely.
const TWILIO_CONFIG: TwilioConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || '',
  whatsappNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886',
};

const OWNER_WHATSAPP = `whatsapp:+${import.meta.env.VITE_OWNER_WHATSAPP || ''}` as string;

/**
 * Send WhatsApp message via Twilio API
 */
async function sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_CONFIG.accountSid}/Messages.json`;

    const formData = new URLSearchParams();
    formData.append('From', TWILIO_CONFIG.whatsappNumber);
    formData.append('To', to);
    formData.append('Body', message);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_CONFIG.accountSid}:${TWILIO_CONFIG.authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ WhatsApp message sent successfully:', data.sid);
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Failed to send WhatsApp:', error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error);
    return false;
  }
}

/**
 * Send booking notification to owner (you)
 */
export async function notifyOwnerNewBooking(booking: Booking): Promise<boolean> {
  const message = `
🔔 *حجز جديد - New Booking*

👤 العميل: ${booking.customerName}
📱 الهاتف: ${booking.customerPhone}
✂️ الخدمة: ${booking.service}
📅 التاريخ: ${booking.date.toLocaleDateString('ar-EG')}
⏰ الوقت: ${booking.time}

*SHOKHA BARBERSHOP*
  `.trim();

  return await sendWhatsAppMessage(OWNER_WHATSAPP, message);
}

/**
 * Send approval confirmation to customer
 */
export async function sendCustomerApproval(booking: Booking): Promise<boolean> {
  // Format phone number for WhatsApp
  let customerPhone = booking.customerPhone.replace(/\D/g, '');
  if (customerPhone.startsWith('0')) {
    customerPhone = '972' + customerPhone.substring(1);
  }
  const whatsappNumber = `whatsapp:+${customerPhone}`;

  const message = `
✅ *موعدك مؤكد - Appointment Confirmed*

مرحباً ${booking.customerName}! 👋

تم تأكيد موعدك بنجاح:
📅 التاريخ: ${booking.date.toLocaleDateString('ar-EG')}
⏰ الوقت: ${booking.time}
✂️ الخدمة: ${booking.service}

📍 *SHOKHA BARBERSHOP*
كفر ياسيف

نراك قريباً! ✨
See you soon!
  `.trim();

  return await sendWhatsAppMessage(whatsappNumber, message);
}

/**
 * Send rejection notification to customer
 */
export async function sendCustomerRejection(booking: Booking): Promise<boolean> {
  // Format phone number for WhatsApp
  let customerPhone = booking.customerPhone.replace(/\D/g, '');
  if (customerPhone.startsWith('0')) {
    customerPhone = '972' + customerPhone.substring(1);
  }
  const whatsappNumber = `whatsapp:+${customerPhone}`;

  const message = `
❌ *عذراً - Appointment Unavailable*

عزيزي ${booking.customerName},

للأسف الموعد المطلوب غير متاح:
📅 ${booking.date.toLocaleDateString('ar-EG')} - ${booking.time}

يرجى اختيار موعد آخر من موقعنا:
🌐 ${window.location.origin}

شكراً لتفهمك 🙏
*SHOKHA BARBERSHOP*
  `.trim();

  return await sendWhatsAppMessage(whatsappNumber, message);
}

// ⚠️ REMOVED: updateTwilioConfig() and loadTwilioConfig() functions
// SECURITY FIX: Never store credentials in localStorage!
// All configuration should come from environment variables only.
// If you need dynamic configuration, it must be done server-side.
