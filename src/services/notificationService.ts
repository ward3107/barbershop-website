// Notification Service for SHOKHA Barbershop
// This service handles sending notifications to the owner and customers

interface NotificationConfig {
  // WhatsApp Business API (Recommended)
  whatsappApiUrl?: string;
  whatsappToken?: string;
  ownerWhatsapp?: string; // Owner's WhatsApp number

  // Email Service (using EmailJS - free tier available)
  emailServiceId?: string;
  emailTemplateId?: string;
  emailUserId?: string;
  ownerEmail?: string;

  // SMS Service (using Twilio)
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioPhoneNumber?: string;
  ownerPhone?: string;
}

// Configuration - Using environment variables for security
const config: NotificationConfig = {
  // WhatsApp - Most recommended for Middle East
  ownerWhatsapp: import.meta.env.VITE_OWNER_WHATSAPP || '',

  // Email - using EmailJS (free for 200 emails/month)
  emailServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  emailTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  emailUserId: import.meta.env.VITE_EMAILJS_USER_ID || '',
  ownerEmail: import.meta.env.VITE_OWNER_EMAIL || 'owner@shokhabarbershop.com',

  // SMS - using Twilio
  ownerPhone: import.meta.env.VITE_OWNER_PHONE || '',
};

// 1. WHATSAPP NOTIFICATION (Most Recommended for Israel/Palestine)
export async function sendWhatsAppToOwner(booking: any) {
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

  // Option 1: Direct WhatsApp Web Link (Simple, No API needed)
  // Remove + from phone number for wa.me URL
  const phoneNumber = config.ownerWhatsapp?.replace('+', '');
  const whatsappWebUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  console.log('📱 Opening WhatsApp with URL:', whatsappWebUrl);
  window.open(whatsappWebUrl, '_blank');

  // Option 2: WhatsApp Business API (Requires setup)
  if (config.whatsappApiUrl && config.whatsappToken) {
    try {
      await fetch(config.whatsappApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: config.ownerWhatsapp,
          text: message
        })
      });
    } catch (error) {
      console.error('WhatsApp API error:', error);
    }
  }
}

// 2. EMAIL NOTIFICATION (Using EmailJS - Easy Setup)
export async function sendEmailToOwner(booking: any) {
  // EmailJS requires: npm install @emailjs/browser
  try {
    // Skip if EmailJS not configured
    if (!config.emailServiceId || config.emailServiceId === 'YOUR_EMAILJS_SERVICE_ID') {
      console.log('📧 EmailJS not configured, skipping email notification');
      return;
    }

    // Try to use EmailJS if available
    try {
      // @ts-ignore - EmailJS may not be installed
      const emailjs = await import('@emailjs/browser');

      const templateParams = {
        to_email: config.ownerEmail,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        service: booking.service,
        date: booking.date.toLocaleDateString(),
        time: booking.time,
        booking_id: booking.id,
        approve_link: `${window.location.origin}/admin?approve=${booking.id}`,
        reject_link: `${window.location.origin}/admin?reject=${booking.id}`
      };

      await emailjs.send(
        config.emailServiceId!,
        config.emailTemplateId!,
        templateParams,
        config.emailUserId
      );

      console.log('Email sent to owner!');
    } catch (importError) {
      console.log('📧 EmailJS not installed, skipping email');
    }
  } catch (error) {
    console.error('Email error (safe to ignore):', error);
    // Fallback to mailto link
    const subject = `New Booking: ${booking.customerName}`;
    const body = `
New booking request:
Customer: ${booking.customerName}
Phone: ${booking.customerPhone}
Service: ${booking.service}
Date: ${booking.date.toLocaleDateString()}
Time: ${booking.time}
    `;
    window.location.href = `mailto:${config.ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
}

// 3. SMS NOTIFICATION (Using Twilio - Costs money)
export async function sendSMSToOwner(booking: any) {
  const message = `New SHOKHA booking:
${booking.customerName}
${booking.customerPhone}
${booking.service}
${booking.date.toLocaleDateString()} ${booking.time}`;

  // Using Twilio (requires backend for security)
  try {
    // This should be done on backend to hide credentials
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: config.ownerPhone,
        message: message
      })
    });

    if (response.ok) {
      console.log('SMS sent to owner!');
    }
  } catch (error) {
    console.error('SMS error:', error);
  }
}

// 4. TELEGRAM BOT (Free and Easy)
export async function sendTelegramToOwner(booking: any) {
  // First create a Telegram bot using @BotFather
  const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
  const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot not configured');
    return;
  }

  const message = `
🔔 <b>New Booking Request</b>
👤 Customer: ${booking.customerName}
📱 Phone: ${booking.customerPhone}
✂️ Service: ${booking.service}
📅 Date: ${booking.date.toLocaleDateString()}
⏰ Time: ${booking.time}

Use /approve_${booking.id} or /reject_${booking.id}
  `.trim();

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    console.log('Telegram message sent!');
  } catch (error) {
    console.error('Telegram error:', error);
  }
}

// 5. PUSH NOTIFICATIONS (Using Firebase Cloud Messaging)
export async function sendPushNotification(_booking: any) {
  // ⚠️ SECURITY WARNING: FCM server key should be on backend only!
  // This functionality has been disabled for security reasons.
  // To implement push notifications securely, use Firebase Admin SDK on your backend.
  console.warn('FCM push notifications should be implemented server-side for security');
  return;
}

// Main function to notify owner (uses multiple methods)
export async function notifyOwnerOfNewBooking(booking: any) {
  console.log('📱 Notifying owner of new booking:', booking);
  console.log('📞 Owner WhatsApp configured:', config.ownerWhatsapp);

  // Try multiple notification methods
  try {
    // Method 1: WhatsApp (Most reliable in Middle East)
    if (config.ownerWhatsapp) {
      console.log('✅ Sending WhatsApp notification to:', config.ownerWhatsapp);
      await sendWhatsAppToOwner(booking);
    } else {
      console.log('❌ No WhatsApp number configured');
    }

    // Method 2: Email (Backup)
    if (config.ownerEmail) {
      await sendEmailToOwner(booking);
    }

    // Method 3: Telegram (If configured)
    // await sendTelegramToOwner(booking);

    // Method 4: Browser Notification (Immediate, if owner has site open)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Booking Request!', {
        body: `${booking.customerName} - ${booking.service}`,
        icon: '/logo.png',
        tag: booking.id
      });
    }

    // Store in localStorage for owner dashboard
    const pendingBookings = JSON.parse(localStorage.getItem('shokha_pending_bookings') || '[]');
    pendingBookings.push(booking);
    localStorage.setItem('shokha_pending_bookings', JSON.stringify(pendingBookings));

  } catch (error) {
    console.error('Error notifying owner:', error);
  }
}

// Customer notification when booking is approved/rejected
export async function notifyCustomer(booking: any, status: 'approved' | 'rejected') {
  const message = status === 'approved'
    ? `✅ Your booking at SHOKHA is confirmed!\n📅 ${booking.date.toLocaleDateString()}\n⏰ ${booking.time}\n📱 Add to calendar: ${generateCalendarLink(booking)}`
    : `❌ Sorry, your requested time is not available. Please book another time.`;

  // Send WhatsApp to customer
  const whatsappUrl = `https://wa.me/${booking.customerPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');

  // Send Email if provided
  if (booking.customerEmail) {
    // Use EmailJS or other email service
  }
}

// Helper function to generate calendar link
function generateCalendarLink(booking: any) {
  const startDate = new Date(booking.date);
  const [hours, minutes] = booking.time.split(':');
  startDate.setHours(parseInt(hours), parseInt(minutes));

  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 40);

  // Google Calendar link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('SHOKHA - ' + booking.service)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&location=${encodeURIComponent('SHOKHA Barbershop, Kfar Yassif')}`;

  return googleCalendarUrl;
}