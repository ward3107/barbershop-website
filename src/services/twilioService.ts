// ⚠️ SECURITY FIX: Twilio Service DISABLED
// ========================================
// This service has been DISABLED for security reasons.
// Twilio credentials should NEVER be exposed in frontend code.
//
// TO ENABLE NOTIFICATIONS:
// 1. Create a backend API endpoint (Node.js, Python, etc.)
// 2. Store Twilio credentials on the backend server
// 3. Call your backend API from the frontend
// 4. Backend API uses Twilio SDK to send messages
//
// Example backend endpoint:
// POST /api/send-notification
// Body: { bookingId, customerPhone, message }
// ========================================

import type { Booking } from '@/types';

// REMOVED: sendWhatsAppMessage function (security fix)
// This function has been removed because it exposed Twilio credentials in the frontend.
// Implement a backend API endpoint instead.

/**
 * DISABLED: Send booking notification to owner
 * Implement a backend API instead.
 */
export async function notifyOwnerNewBooking(booking: Booking): Promise<boolean> {
  console.warn('⚠️ SECURITY: Notification service disabled. Implement backend API.');
  console.log('New booking:', {
    customer: booking.customerName,
    service: booking.service,
    date: booking.date,
    time: booking.time
  });
  return false;
}

/**
 * DISABLED: Send approval confirmation to customer
 * Implement a backend API instead.
 */
export async function sendCustomerApproval(booking: Booking): Promise<boolean> {
  console.warn('⚠️ SECURITY: Notification service disabled. Implement backend API.');
  console.log('Would approve booking for:', booking.customerName);
  return false;
}

/**
 * DISABLED: Send rejection notification to customer
 * Implement a backend API instead.
 */
export async function sendCustomerRejection(booking: Booking): Promise<boolean> {
  console.warn('⚠️ SECURITY: Notification service disabled. Implement backend API.');
  console.log('Would reject booking for:', booking.customerName);
  return false;
}
