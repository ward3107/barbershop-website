// Input validation schemas using Zod
// Validates all user inputs to prevent injection attacks and data corruption

import { z } from 'zod';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

// ===== Common Validators =====

// Name validator - allows letters, spaces, hyphens, apostrophes
// Supports Arabic, Hebrew, and Latin characters
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(
    /^[a-zA-Z\u0590-\u05FF\u0600-\u06FF\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  )
  .transform(val => val.trim());

// Phone validator - validates Israeli phone numbers
export const phoneSchema = z.string()
  .refine((phone) => {
    try {
      // Remove all non-digit characters for validation
      const cleaned = phone.replace(/\D/g, '');

      // Israeli phone numbers: 05XXXXXXXX or 972XXXXXXXXX
      if (cleaned.startsWith('05') && cleaned.length === 10) {
        return true;
      }
      if (cleaned.startsWith('972') && cleaned.length === 12) {
        return true;
      }

      // Try libphonenumber validation
      return isValidPhoneNumber(phone, 'IL');
    } catch {
      return false;
    }
  }, 'Please enter a valid Israeli phone number (e.g., 05XXXXXXXX)')
  .transform(val => val.trim());

// Optional phone validator
export const optionalPhoneSchema = z.string()
  .optional()
  .refine((phone) => {
    if (!phone || phone.trim() === '') return true;
    try {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.startsWith('05') && cleaned.length === 10) return true;
      if (cleaned.startsWith('972') && cleaned.length === 12) return true;
      return isValidPhoneNumber(phone, 'IL');
    } catch {
      return false;
    }
  }, 'Please enter a valid Israeli phone number');

// Email validator
export const emailSchema = z.string()
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .transform(val => val.trim());

// Optional email validator
export const optionalEmailSchema = z.string()
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')
  .optional()
  .or(z.literal(''))
  .transform(val => val ? val.trim().toLowerCase() : undefined);

// ===== Service Validators =====

// Available services
export const serviceSchema = z.enum([
  'Classic Haircut',
  'Fade',
  'Beard Trim',
  'Hot Towel Shave',
  'Hair Coloring',
  'Kids Haircut',
  'Haircut + Beard',
  'Premium Package'
], {
  errorMap: () => ({ message: 'Please select a valid service' })
});

// ===== Date/Time Validators =====

// Date validator - must be today or in the future
export const dateSchema = z.date()
  .refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    'Date must be today or in the future'
  );

// Time validator - HH:MM format
export const timeSchema = z.string()
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)')
  .refine(
    (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      // Business hours: 9:00 - 20:00
      if (hours < 9 || hours > 20) {
        return false;
      }
      // If 20:00, only allow :00
      if (hours === 20 && minutes > 0) {
        return false;
      }
      return true;
    },
    'Please select a time between 9:00 AM and 8:00 PM'
  );

// ===== Booking Schema =====

export const bookingSchema = z.object({
  customerName: nameSchema,
  customerPhone: phoneSchema,
  customerEmail: optionalEmailSchema,
  service: serviceSchema,
  date: dateSchema,
  time: timeSchema,
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
    .transform(val => val ? val.trim() : undefined)
});

export type BookingInput = z.infer<typeof bookingSchema>;

// ===== Auth Schemas =====

// Password schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Signup schema
export const signupSchema = z.object({
  displayName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: optionalPhoneSchema
});

export type SignupInput = z.infer<typeof signupSchema>;

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

export type LoginInput = z.infer<typeof loginSchema>;

// ===== Review Schema =====

export const reviewSchema = z.object({
  rating: z.number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating must be at most 5 stars'),
  comment: z.string()
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review must be less than 1000 characters')
    .transform(val => val.trim()),
  customerName: nameSchema
});

export type ReviewInput = z.infer<typeof reviewSchema>;

// ===== Helper Functions =====

/**
 * Safely parse and validate input
 * Returns { success: true, data } or { success: false, error }
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError?.message || 'Validation failed'
      };
    }
    return {
      success: false,
      error: 'An unexpected error occurred during validation'
    };
  }
}

/**
 * Format phone number for WhatsApp
 * Converts 05XXXXXXXX to 972XXXXXXXXX
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('05')) {
    return '972' + cleaned.substring(1);
  }

  if (cleaned.startsWith('972')) {
    return cleaned;
  }

  // Try to parse with libphonenumber
  try {
    const parsed = parsePhoneNumber(phone, 'IL');
    if (parsed) {
      return parsed.format('E.164').replace('+', '');
    }
  } catch {
    // Fallback to cleaned number
  }

  return cleaned;
}

/**
 * Sanitize string for display (prevent XSS)
 * Note: React already escapes by default, but this is extra safety
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}
