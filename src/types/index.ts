/**
 * Centralized Type Definitions
 *
 * This file contains all shared types used across the application.
 * Import from here instead of defining types in individual files.
 */

/**
 * Booking Status Types
 */
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';

/**
 * Main Booking Interface
 *
 * Used across all booking-related services and components
 */
export interface Booking {
  id?: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: Date;
  time: string;
  status: BookingStatus;
  createdAt: Date;
  notes?: string;
  cancelledAt?: Date;
  cancelledBy?: 'customer' | 'admin';
  rescheduledAt?: Date;
}

/**
 * Firestore Booking Data
 *
 * Used when reading/writing to Firestore (uses Firestore Timestamp)
 */
export interface FirestoreBooking {
  id?: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  date: any; // Firestore Timestamp
  time: string;
  status: BookingStatus;
  createdAt: any; // Firestore Timestamp
  notes?: string;
  cancelledAt?: any; // Firestore Timestamp
  cancelledBy?: 'customer' | 'admin';
  rescheduledAt?: any; // Firestore Timestamp
}

/**
 * User Role Types
 */
export type UserRole = 'user' | 'admin' | 'owner';

/**
 * User Profile Interface
 */
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  phone?: string;
  photoURL?: string;
  loyaltyPoints?: number;
  totalBookings?: number;
  createdAt: Date;
  // Role-based access control
  role?: UserRole;
  isAdmin?: boolean; // Legacy support - deprecated, use role instead
  isOwner?: boolean; // Legacy support - deprecated, use role instead
}

/**
 * Language Types
 */
export type Language = 'en' | 'ar' | 'he';

/**
 * Service Types
 */
export interface Service {
  id: string;
  name: string;
  nameAr: string;
  nameHe: string;
  description?: string;
  descriptionAr?: string;
  descriptionHe?: string;
  duration: number; // in minutes
  price?: number;
}

/**
 * Day Booking Info (for calendar)
 */
export interface DayBookingInfo {
  date: Date;
  bookings: Booking[];
  availableSlots: string[];
  bookedSlots: string[];
}

/**
 * Notification Types
 */
export interface NotificationPayload {
  booking: Booking;
  type: 'new_booking' | 'approved' | 'rejected' | 'reminder' | 'completed';
  recipientPhone?: string;
  recipientEmail?: string;
}

/**
 * Type Guards
 */
export function isBooking(obj: any): obj is Booking {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.customerName === 'string' &&
    typeof obj.customerPhone === 'string' &&
    typeof obj.service === 'string' &&
    typeof obj.time === 'string' &&
    ['pending', 'approved', 'rejected', 'completed'].includes(obj.status)
  );
}
