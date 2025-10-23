// Make.com Webhook Service
// Sends booking data to Make.com for WhatsApp automation

import type { Booking } from '@/types';
import { getStorageItem } from '@/utils/storage';
import { logger } from '@/utils/logger';

// Make.com Webhook URL - You'll get this from Make.com after creating scenario
const MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || '';

/**
 * Webhook event types
 */
type WebhookEvent = 'new_booking' | 'booking_approved' | 'booking_rejected' | 'booking_completed';

/**
 * Get active webhook URL
 */
function getWebhookUrl(): string | null {
  const savedUrl = getStorageItem<string>('make_webhook_url', '');
  if (savedUrl && savedUrl !== 'YOUR_MAKE_WEBHOOK_URL_HERE') {
    return savedUrl;
  }
  if (MAKE_WEBHOOK_URL && MAKE_WEBHOOK_URL !== 'YOUR_MAKE_WEBHOOK_URL_HERE') {
    return MAKE_WEBHOOK_URL;
  }
  return null;
}

/**
 * Generic webhook sender to eliminate code duplication
 */
async function sendWebhookEvent(
  event: WebhookEvent,
  booking: Booking,
  eventLabel: string
): Promise<boolean> {
  try {
    const webhookUrl = getWebhookUrl();

    if (!webhookUrl) {
      logger.warn('Make.com webhook not configured - skipping notification');
      return true; // Return true to not block the booking
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event,
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
      logger.info(`${eventLabel} sent to Make.com successfully`);
      return true;
    } else {
      logger.error(`Make.com webhook failed for ${eventLabel}:`, response.status);
      return false;
    }
  } catch (error) {
    logger.error(`Error sending ${eventLabel} to Make.com:`, error);
    return false;
  }
}

/**
 * Send new booking to Make.com
 * Make.com will then send WhatsApp to owner
 */
export async function sendBookingToMake(booking: Booking): Promise<boolean> {
  return sendWebhookEvent('new_booking', booking, 'New booking');
}

/**
 * Send approval notification to Make.com
 * Make.com will send WhatsApp to customer
 */
export async function sendApprovalToMake(booking: Booking): Promise<boolean> {
  return sendWebhookEvent('booking_approved', booking, 'Booking approval');
}

/**
 * Send rejection notification to Make.com
 * Make.com will send WhatsApp to customer
 */
export async function sendRejectionToMake(booking: Booking): Promise<boolean> {
  return sendWebhookEvent('booking_rejected', booking, 'Booking rejection');
}

/**
 * Send completion notification to Make.com
 * Make.com will send WhatsApp to customer
 */
export async function sendCompletionToMake(booking: Booking): Promise<boolean> {
  return sendWebhookEvent('booking_completed', booking, 'Booking completion');
}

// ⚠️ REMOVED: setMakeWebhookUrl() and loadMakeWebhookUrl() functions
// SECURITY FIX: Configuration should come from environment variables only.
