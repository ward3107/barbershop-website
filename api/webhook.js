// Vercel Serverless Function - Webhook for Make.com
// This receives new bookings and sends them to Make.com
// Includes HMAC signature verification for security

import crypto from 'crypto';

/**
 * Verify webhook signature using HMAC-SHA256
 * @param {string} payload - The raw request body
 * @param {string} signature - The signature from the request header
 * @param {string} secret - The webhook secret
 * @returns {boolean} - Whether the signature is valid
 */
function verifySignature(payload, signature, secret) {
  if (!signature || !secret) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Verify request timestamp to prevent replay attacks
 * @param {string} timestamp - The timestamp from the request header
 * @param {number} maxAgeSeconds - Maximum age of request in seconds (default: 300 = 5 minutes)
 * @returns {boolean} - Whether the timestamp is valid
 */
function verifyTimestamp(timestamp, maxAgeSeconds = 300) {
  if (!timestamp) return false;

  try {
    const requestTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const age = Math.abs(currentTime - requestTime);

    return age <= maxAgeSeconds;
  } catch (error) {
    console.error('Timestamp verification error:', error);
    return false;
  }
}

/**
 * Rate limiting (simple in-memory implementation)
 * For production, use Redis or similar
 */
const requestCounts = new Map();

function checkRateLimit(ip, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const userRequests = requestCounts.get(ip) || [];

  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false; // Rate limit exceeded
  }

  // Add current request
  recentRequests.push(now);
  requestCounts.set(ip, recentRequests);

  return true;
}

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP for rate limiting
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    // Check rate limit (10 requests per minute per IP)
    if (!checkRateLimit(clientIp, 10, 60000)) {
      console.warn(`Rate limit exceeded for IP: ${clientIp}`);
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    // Get webhook secret from environment variable
    const webhookSecret = process.env.WEBHOOK_SECRET;

    // If webhook secret is configured, verify signature
    if (webhookSecret) {
      const signature = req.headers['x-webhook-signature'];
      const timestamp = req.headers['x-webhook-timestamp'];

      // Verify timestamp first (prevent replay attacks)
      if (!verifyTimestamp(timestamp)) {
        console.warn(`Invalid or expired timestamp from IP: ${clientIp}`);
        return res.status(401).json({ error: 'Request timestamp is invalid or expired' });
      }

      // Get raw body for signature verification
      const rawBody = JSON.stringify(req.body);
      const signaturePayload = `${timestamp}.${rawBody}`;

      // Verify signature
      if (!verifySignature(signaturePayload, signature, webhookSecret)) {
        console.warn(`Invalid signature from IP: ${clientIp}`);
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      console.log('✅ Webhook signature verified');
    } else {
      console.warn('⚠️ Webhook secret not configured - skipping signature verification');
      console.warn('⚠️ Set WEBHOOK_SECRET environment variable for production');
    }

    // Validate booking data
    const { booking } = req.body;

    if (!booking || !booking.customerName || !booking.customerPhone) {
      return res.status(400).json({ error: 'Invalid booking data: missing required fields' });
    }

    // Additional validation
    if (typeof booking.customerName !== 'string' || booking.customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Invalid customer name' });
    }

    if (typeof booking.customerPhone !== 'string' || booking.customerPhone.trim().length < 8) {
      return res.status(400).json({ error: 'Invalid customer phone' });
    }

    // Make.com will receive this data
    // You'll configure Make.com to listen to this webhook
    console.log('📨 Webhook received valid booking');

    return res.status(200).json({
      success: true,
      message: 'Booking received and validated',
      bookingId: booking.id
    });

  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * HOW TO USE WEBHOOK SIGNATURE VERIFICATION:
 *
 * 1. Set WEBHOOK_SECRET environment variable in Vercel:
 *    vercel env add WEBHOOK_SECRET production
 *    (Enter a random 32+ character string)
 *
 * 2. When sending webhook requests, include these headers:
 *    - x-webhook-timestamp: Current Unix timestamp in seconds
 *    - x-webhook-signature: HMAC-SHA256 signature
 *
 * 3. Generate signature (example in Node.js):
 *    const crypto = require('crypto');
 *    const timestamp = Math.floor(Date.now() / 1000);
 *    const payload = `${timestamp}.${JSON.stringify(body)}`;
 *    const signature = crypto.createHmac('sha256', WEBHOOK_SECRET)
 *      .update(payload)
 *      .digest('hex');
 *
 * 4. Send request:
 *    fetch('https://your-domain.com/api/webhook', {
 *      method: 'POST',
 *      headers: {
 *        'Content-Type': 'application/json',
 *        'x-webhook-timestamp': timestamp.toString(),
 *        'x-webhook-signature': signature
 *      },
 *      body: JSON.stringify({ booking: {...} })
 *    });
 */
