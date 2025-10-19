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

// IMPORTANT: Get these from Twilio Dashboard
// https://console.twilio.com/
const TWILIO_CONFIG: TwilioConfig = {
  accountSid: 'YOUR_ACCOUNT_SID', // Get from Twilio Console
  authToken: 'YOUR_AUTH_TOKEN',   // Get from Twilio Console
  whatsappNumber: 'whatsapp:+14155238886', // Twilio Sandbox number or your approved number
};

const OWNER_WHATSAPP = 'whatsapp:+972XXXXXXXXX'; // Replace with your WhatsApp number

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

/**
 * Update Twilio configuration
 * Call this function after you get your Twilio credentials
 */
export function updateTwilioConfig(accountSid: string, authToken: string, whatsappNumber: string) {
  TWILIO_CONFIG.accountSid = accountSid;
  TWILIO_CONFIG.authToken = authToken;
  TWILIO_CONFIG.whatsappNumber = whatsappNumber;

  // Save to localStorage for persistence
  localStorage.setItem('twilio_config', JSON.stringify(TWILIO_CONFIG));

  console.log('✅ Twilio configuration updated successfully!');
}

/**
 * Load Twilio config from localStorage on startup
 */
export function loadTwilioConfig() {
  const saved = localStorage.getItem('twilio_config');
  if (saved) {
    const config = JSON.parse(saved);
    TWILIO_CONFIG.accountSid = config.accountSid;
    TWILIO_CONFIG.authToken = config.authToken;
    TWILIO_CONFIG.whatsappNumber = config.whatsappNumber;
    console.log('✅ Twilio configuration loaded');
  }
}

// Load config on module import
loadTwilioConfig();
