// Vercel Serverless Function - Webhook for Make.com
// This receives new bookings and sends them to Make.com

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { booking } = req.body;

    // Validate booking data
    if (!booking || !booking.customerName || !booking.customerPhone) {
      return res.status(400).json({ error: 'Invalid booking data' });
    }

    // Make.com will receive this data
    // You'll configure Make.com to listen to this webhook
    console.log('📨 Webhook received booking:', booking);

    return res.status(200).json({
      success: true,
      message: 'Booking received',
      booking: booking
    });

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
