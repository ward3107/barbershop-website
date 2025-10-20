// Make.com Webhook Service
// Sends booking data to Make.com for WhatsApp automation

interface Booking {
  id?: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: Date;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt?: Date | any;
  notes?: string;
}

// Make.com Webhook URL - You'll get this from Make.com after creating scenario
const MAKE_WEBHOOK_URL = 'YOUR_MAKE_WEBHOOK_URL_HERE';

/**
 * Send new booking to Make.com
 * Make.com will then send WhatsApp to owner
 */
export async function sendBookingToMake(booking: Booking): Promise<boolean> {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'new_booking',
        booking: {
          id: booking.id,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerEmail: booking.customerEmail,
          service: booking.service,
          date: booking.date.toISOString(),
          time: booking.time,
          status: booking.status,
        }
      })
    });

    if (response.ok) {
      console.log('✅ Booking sent to Make.com successfully');
      return true;
    } else {
      console.error('❌ Make.com webhook failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending to Make.com:', error);
    return false;
  }
}

/**
 * Send approval notification to Make.com
 * Make.com will send WhatsApp to customer
 */
export async function sendApprovalToMake(booking: Booking): Promise<boolean> {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'booking_approved',
        booking: {
          id: booking.id,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          service: booking.service,
          date: booking.date.toISOString(),
          time: booking.time,
        }
      })
    });

    if (response.ok) {
      console.log('✅ Approval sent to Make.com successfully');
      return true;
    } else {
      console.error('❌ Make.com webhook failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending approval to Make.com:', error);
    return false;
  }
}

/**
 * Send rejection notification to Make.com
 * Make.com will send WhatsApp to customer
 */
export async function sendRejectionToMake(booking: Booking): Promise<boolean> {
  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'booking_rejected',
        booking: {
          id: booking.id,
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          service: booking.service,
          date: booking.date.toISOString(),
          time: booking.time,
        }
      })
    });

    if (response.ok) {
      console.log('✅ Rejection sent to Make.com successfully');
      return true;
    } else {
      console.error('❌ Make.com webhook failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending rejection to Make.com:', error);
    return false;
  }
}

/**
 * Update Make.com webhook URL
 * Call this after you get your webhook URL from Make.com
 */
export function setMakeWebhookUrl(url: string) {
  // Save to localStorage for persistence
  localStorage.setItem('make_webhook_url', url);
  console.log('✅ Make.com webhook URL updated:', url);
}

/**
 * Load webhook URL from localStorage
 */
export function loadMakeWebhookUrl() {
  const saved = localStorage.getItem('make_webhook_url');
  if (saved) {
    console.log('✅ Make.com webhook URL loaded');
    return saved;
  }
  return null;
}
