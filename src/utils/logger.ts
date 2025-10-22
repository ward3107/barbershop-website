// Secure Logger Utility
// Logs messages while automatically redacting Personally Identifiable Information (PII)
// Use this instead of console.log to prevent accidental PII leaks

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Check if we're in production
const isProd = import.meta.env.PROD;

// Sensitive field names that should be redacted
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'secret',
  'apiKey',
  'authToken',
  'accessToken',
  'refreshToken',
  'customerPhone',
  'phone',
  'phoneNumber',
  'customerEmail',
  'email',
  'creditCard',
  'ssn',
  'socialSecurity',
  'accountSid',
  'authToken'
];

// Phone number pattern (matches various formats)
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g;

// Email pattern
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Credit card pattern (basic)
const CREDIT_CARD_REGEX = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;

/**
 * Redact PII from a string
 */
function redactString(str: string): string {
  if (typeof str !== 'string') return str;

  let redacted = str;

  // Redact phone numbers
  redacted = redacted.replace(PHONE_REGEX, '[PHONE_REDACTED]');

  // Redact emails
  redacted = redacted.replace(EMAIL_REGEX, '[EMAIL_REDACTED]');

  // Redact credit cards
  redacted = redacted.replace(CREDIT_CARD_REGEX, '[CARD_REDACTED]');

  return redacted;
}

/**
 * Redact PII from an object
 */
function redactObject(obj: any, depth = 0): any {
  // Prevent infinite recursion
  if (depth > 10) return '[MAX_DEPTH_REACHED]';

  if (obj === null || obj === undefined) return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => redactObject(item, depth + 1));
  }

  // Handle objects
  if (typeof obj === 'object') {
    const redacted: any = {};

    for (const key in obj) {
      if (!obj.hasOwnProperty(key)) continue;

      const lowerKey = key.toLowerCase();
      const value = obj[key];

      // Check if this field should be redacted
      const shouldRedact = SENSITIVE_FIELDS.some(field =>
        lowerKey.includes(field.toLowerCase())
      );

      if (shouldRedact) {
        // Redact the entire field
        if (typeof value === 'string') {
          redacted[key] = '[REDACTED]';
        } else {
          redacted[key] = '[REDACTED]';
        }
      } else if (typeof value === 'string') {
        // Redact PII patterns in strings
        redacted[key] = redactString(value);
      } else if (typeof value === 'object') {
        // Recursively redact nested objects
        redacted[key] = redactObject(value, depth + 1);
      } else {
        // Keep other types as-is
        redacted[key] = value;
      }
    }

    return redacted;
  }

  // Handle strings
  if (typeof obj === 'string') {
    return redactString(obj);
  }

  // Return primitives as-is
  return obj;
}

/**
 * Redact PII from data before logging
 */
function redactPII(data: any): any {
  if (data === null || data === undefined) return data;

  try {
    // Make a deep copy to avoid modifying original
    const copy = JSON.parse(JSON.stringify(data));
    return redactObject(copy);
  } catch (error) {
    // If JSON serialization fails, try basic redaction
    return redactObject(data);
  }
}

/**
 * Format log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string): string {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

/**
 * Logger class with PII redaction
 */
class Logger {
  /**
   * Debug level logging (disabled in production)
   */
  debug(message: string, data?: any): void {
    if (isProd) return; // Skip debug logs in production

    const redacted = data ? redactPII(data) : undefined;
    const formatted = formatMessage('debug', message);

    if (redacted !== undefined) {
      console.log(formatted, redacted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any): void {
    const redacted = data ? redactPII(data) : undefined;
    const formatted = formatMessage('info', message);

    if (redacted !== undefined) {
      console.log(formatted, redacted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any): void {
    const redacted = data ? redactPII(data) : undefined;
    const formatted = formatMessage('warn', message);

    if (redacted !== undefined) {
      console.warn(formatted, redacted);
    } else {
      console.warn(formatted);
    }
  }

  /**
   * Error level logging
   * Note: Errors themselves are not redacted, but attached data is
   */
  error(message: string, error?: any, data?: any): void {
    const formatted = formatMessage('error', message);

    console.error(formatted);

    if (error) {
      // Log error separately (don't redact error messages/stack traces)
      console.error(error);
    }

    if (data) {
      // Redact any additional data
      console.error('Additional data:', redactPII(data));
    }
  }

  /**
   * Log without redaction (use sparingly and only for non-sensitive data)
   */
  raw(message: string, data?: any): void {
    if (isProd) {
      console.warn('WARNING: Raw logging used in production');
    }
    console.log(formatMessage('raw', message), data);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export redaction function for manual use
export { redactPII };

// Example usage:
// logger.info('User logged in', { email: 'user@example.com', phone: '0501234567' });
// Output: [2025-10-22T...] [INFO] User logged in { email: '[EMAIL_REDACTED]', phone: '[PHONE_REDACTED]' }
