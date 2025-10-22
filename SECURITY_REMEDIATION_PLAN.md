# Security Remediation Plan - SHOKHA Barbershop Website

**Created:** 2025-10-22
**Status:** IN PROGRESS
**Priority:** CRITICAL
**Estimated Completion:** 2-3 weeks

---

## Executive Summary

This document outlines the comprehensive security remediation plan for the SHOKHA Barbershop website. A security audit identified **20 critical/high-priority vulnerabilities** that require immediate attention before production deployment.

**Current Security Status:** 🔴 **HIGH RISK** - Not production-ready
**Target Security Status:** 🟢 **LOW RISK** - Production-ready with industry best practices

---

## Phase 1: CRITICAL FIXES (Week 1, Days 1-3)

### 1.1 Fix XSS Vulnerability in NotificationManager
**Priority:** CRITICAL
**Effort:** 2 hours
**File:** `src/components/NotificationManager.tsx:74`

**Current Code (VULNERABLE):**
```typescript
alertDiv.innerHTML = `
  <div>${booking.customerName} - ${booking.service}</div>
`;
```

**Fixed Code:**
```typescript
// Use React Portal instead of innerHTML
import { createPortal } from 'react-dom';

const InPageAlert = ({ booking, onClose }: { booking: any, onClose: () => void }) => (
  <div className="fixed top-20 right-4 z-50 animate-slide-in">
    <div className="bg-gradient-to-r from-[#FFD700] to-[#C4A572] text-black p-4 rounded-xl shadow-2xl max-w-md relative">
      <button onClick={onClose} className="..." aria-label="Close notification">✕</button>
      <div className="flex items-center gap-3">
        <div className="text-2xl">🔔</div>
        <div className="flex-1">
          <div className="font-bold text-lg">New Booking!</div>
          <div>{booking.customerName} - {booking.service}</div>
          <div className="text-sm opacity-80">{booking.customerPhone} at {booking.time}</div>
        </div>
      </div>
    </div>
  </div>
);
```

**Testing:**
- Attempt XSS injection: `<script>alert('XSS')</script>`
- Verify output is HTML-encoded
- Test with various special characters

---

### 1.2 Remove Credentials from localStorage
**Priority:** CRITICAL
**Effort:** 4 hours
**Files:**
- `src/services/twilioService.ts:155`
- `src/services/makeWebhook.ts:140`

**Changes:**
1. Remove `updateTwilioConfig()` function
2. Remove `localStorage.setItem('twilio_config')`
3. Use environment variables exclusively
4. Add warning comment about credential storage

**Implementation:**
```typescript
// ❌ NEVER DO THIS - REMOVED
// localStorage.setItem('twilio_config', JSON.stringify(TWILIO_CONFIG));

// ✅ Use environment variables instead
const TWILIO_CONFIG = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN,
  whatsappNumber: import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER
};

// ⚠️ SECURITY WARNING: Still client-side - should be moved to backend
```

---

### 1.3 Remove ALL Hardcoded Credentials
**Priority:** CRITICAL
**Effort:** 3 hours

**Files to Update:**
1. `src/services/firebase.ts:9-14`
2. `src/services/twilioService.ts:23-28`
3. `src/services/notificationService.ts:26,35`
4. `src/components/BookingSystem.tsx:404`
5. `src/components/TestNotificationButton.tsx:31`
6. `src/components/WhatsAppQuickSender.tsx:50`

**Search Pattern:**
```bash
grep -r "XXXXXXXXX" src/
grep -r "YOUR_" src/
grep -r "972XXXXXXXXX" src/
```

**Replace with:**
```typescript
const OWNER_WHATSAPP = import.meta.env.VITE_OWNER_WHATSAPP || '';
```

**Add to `.env.example`:**
```env
VITE_OWNER_WHATSAPP=972XXXXXXXXX
VITE_OWNER_PHONE=972XXXXXXXXX
```

---

### 1.4 Add Environment Variable Validation
**Priority:** CRITICAL
**Effort:** 2 hours
**New File:** `src/config/validateEnv.ts`

```typescript
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(
    varName => !import.meta.env[varName] || import.meta.env[varName].includes('YOUR_')
  );

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(
      `Missing environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  console.log('✅ Environment variables validated');
}
```

**Call in:** `src/main.tsx`

---

### 1.5 Implement Webhook Signature Verification
**Priority:** CRITICAL
**Effort:** 4 hours
**File:** `api/webhook.js`

```javascript
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];

  if (!signature || !timestamp) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  // Check timestamp (prevent replay attacks)
  const requestTime = parseInt(timestamp);
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - requestTime) > 300) { // 5 minutes
    return res.status(401).json({ error: 'Request too old' });
  }

  // Verify HMAC signature
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(timestamp + '.' + payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  // Process webhook...
  const { booking } = req.body;

  // Validate booking data
  if (!booking || !booking.customerName || !booking.customerPhone) {
    return res.status(400).json({ error: 'Invalid booking data' });
  }

  console.log('✅ Verified webhook received booking');

  return res.status(200).json({
    success: true,
    message: 'Booking received',
    booking: booking
  });
}
```

---

## Phase 2: HIGH PRIORITY FIXES (Week 1, Days 4-7)

### 2.1 Add Input Validation with Zod
**Priority:** HIGH
**Effort:** 6 hours

**Install:**
```bash
npm install zod libphonenumber-js
```

**Create:** `src/schemas/booking.schema.ts`
```typescript
import { z } from 'zod';
import { parsePhoneNumber } from 'libphonenumber-js';

export const bookingSchema = z.object({
  customerName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\u0590-\u05FF\u0600-\u06FF\s'-]+$/, 'Invalid name format'),

  customerPhone: z.string()
    .refine((phone) => {
      try {
        const parsed = parsePhoneNumber(phone, 'IL');
        return parsed.isValid();
      } catch {
        return false;
      }
    }, 'Invalid phone number'),

  customerEmail: z.string().email('Invalid email').optional(),

  service: z.enum([
    'Classic Haircut',
    'Fade',
    'Beard Trim',
    'Hot Towel Shave',
    'Hair Coloring',
    'Kids Haircut'
  ]),

  date: z.date().refine(
    (date) => date > new Date(),
    'Date must be in the future'
  ),

  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),

  notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
});

export type BookingInput = z.infer<typeof bookingSchema>;
```

**Usage in BookingSystem.tsx:**
```typescript
import { bookingSchema } from '@/schemas/booking.schema';

export async function createBooking(data: any) {
  // Validate input
  try {
    const validated = bookingSchema.parse(data);
    // Proceed with validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
}
```

---

### 2.2 Remove Sensitive Data from Console Logs
**Priority:** HIGH
**Effort:** 4 hours

**Create:** `src/utils/logger.ts`
```typescript
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isProd = import.meta.env.PROD;

function redactPII(data: any): any {
  if (typeof data === 'string') {
    // Redact phone numbers
    return data.replace(/\+?\d{10,15}/g, '***REDACTED***');
  }

  if (typeof data === 'object' && data !== null) {
    const redacted = { ...data };

    // Redact sensitive fields
    const sensitiveFields = ['customerPhone', 'phone', 'email', 'customerEmail'];
    sensitiveFields.forEach(field => {
      if (field in redacted) {
        redacted[field] = '***REDACTED***';
      }
    });

    return redacted;
  }

  return data;
}

export const logger = {
  debug: (message: string, data?: any) => {
    if (!isProd) {
      console.log(`[DEBUG] ${message}`, data ? redactPII(data) : '');
    }
  },

  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data ? redactPII(data) : '');
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? redactPII(data) : '');
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

**Replace all console.log:**
```bash
# Find and replace
console.log → logger.info
console.error → logger.error
console.warn → logger.warn
```

---

### 2.3 Improve Password Validation
**Priority:** HIGH
**Effort:** 2 hours
**File:** `src/components/AuthModal.tsx`

```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Add password strength indicator component
const PasswordStrength = ({ password }: { password: string }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'red' };
    if (strength <= 4) return { label: 'Medium', color: 'yellow' };
    return { label: 'Strong', color: 'green' };
  };

  const { label, color } = getStrength();

  return (
    <div className="mt-1">
      <div className={`h-1 rounded-full bg-${color}-500 transition-all`}
           style={{ width: `${(getStrength().strength / 6) * 100}%` }} />
      <span className={`text-xs text-${color}-500`}>{label}</span>
    </div>
  );
};
```

---

### 2.4 Add Protected Routes
**Priority:** HIGH
**Effort:** 3 hours
**Create:** `src/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { currentUser, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !userProfile?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

**Usage in App.tsx:**
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

<Route path="/admin" element={
  <ProtectedRoute requireAdmin={true}>
    <AdminPage />
  </ProtectedRoute>
} />
```

**Add isAdmin field to user profile:**
```typescript
// In AuthContext.tsx
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  isAdmin: boolean; // NEW
  loyaltyPoints: number;
  totalBookings: number;
  createdAt: any;
}
```

---

### 2.5 Use Crypto.randomUUID() for Booking IDs
**Priority:** HIGH
**Effort:** 1 hour
**File:** `src/components/BookingSystem.tsx:372`

```typescript
// ❌ OLD (Predictable)
id: `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// ✅ NEW (Secure)
id: crypto.randomUUID()
```

**Polyfill for older browsers:**
```typescript
const generateSecureId = (): string => {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
```

---

## Phase 3: MEDIUM PRIORITY FIXES (Week 2)

### 3.1 Add Rate Limiting
**Install:**
```bash
npm install express-rate-limit
```

**Create:** `api/middleware/rateLimit.js`
```javascript
import rateLimit from 'express-rate-limit';

export const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many booking requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Rate limit exceeded',
});
```

---

### 3.2 Add CAPTCHA to Booking Form
**Install:**
```bash
npm install @hcaptcha/react-hcaptcha
```

**Add to AppointmentModal.tsx:**
```typescript
import HCaptcha from '@hcaptcha/react-hcaptcha';

const [captchaToken, setCaptchaToken] = useState('');

<HCaptcha
  sitekey={import.meta.env.VITE_HCAPTCHA_SITE_KEY}
  onVerify={(token) => setCaptchaToken(token)}
/>

// Validate before submitting
if (!captchaToken) {
  throw new Error('Please complete the CAPTCHA');
}
```

---

### 3.3 Configure Firebase Security Rules
**Create:** `firestore.rules`
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // User profiles - only owner can read/write
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Bookings - authenticated users only
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.customerName is string
        && request.resource.data.customerName.size() >= 2
        && request.resource.data.customerName.size() <= 100;
      allow update: if request.auth != null
        && (request.auth.uid == resource.data.userId
           || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow delete: if request.auth != null
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Reviews - read all, write own
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

**Deploy:**
```bash
firebase deploy --only firestore:rules
```

---

### 3.4 Add Security Headers
**Create:** `netlify.toml` (update)
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;
      frame-ancestors 'none';
    """
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

---

## Phase 4: DEPLOYMENT PREPARATION (Week 3)

### 4.1 Pre-Deployment Security Checklist

- [ ] All environment variables configured in hosting platform
- [ ] No hardcoded credentials in source code
- [ ] XSS vulnerability fixed and tested
- [ ] Input validation implemented
- [ ] Rate limiting enabled
- [ ] CAPTCHA added to forms
- [ ] Protected routes implemented
- [ ] Firebase Security Rules deployed
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Test components removed from production build
- [ ] Console.log statements cleaned/redacted
- [ ] Error messages don't expose internals
- [ ] Webhook signature verification enabled
- [ ] Password requirements strengthened
- [ ] Secure booking ID generation
- [ ] Dependencies updated (npm audit fix)
- [ ] Security audit passed

### 4.2 Testing Plan

**Security Testing:**
1. XSS injection attempts
2. SQL injection attempts (if applicable)
3. CSRF token validation
4. Rate limit testing
5. Authentication bypass attempts
6. Authorization testing
7. Input fuzzing
8. Webhook signature forgery attempts

**Penetration Testing:**
- OWASP ZAP scan
- Burp Suite professional scan
- Manual security review

---

## Phase 5: ONGOING SECURITY (Post-Launch)

### 5.1 Monitoring & Alerts

**Setup:**
- Firebase Authentication monitoring
- API usage monitoring (Twilio)
- Error tracking (Sentry)
- Security incident alerts
- Failed login attempt monitoring

### 5.2 Regular Maintenance

**Weekly:**
- Review security logs
- Check for failed authentication attempts
- Monitor API usage for anomalies

**Monthly:**
- Update dependencies (`npm update`)
- Run security audit (`npm audit`)
- Review Firebase Security Rules
- Check for new CVEs

**Quarterly:**
- Full security audit
- Penetration testing
- Review and update security policies
- Security training for team

---

## Success Metrics

- [ ] OWASP Top 10 compliance: 10/10
- [ ] Zero critical vulnerabilities
- [ ] Zero high-priority vulnerabilities
- [ ] All sensitive data encrypted
- [ ] All API endpoints authenticated
- [ ] 100% input validation coverage
- [ ] Security headers A+ rating (securityheaders.com)
- [ ] SSL Labs A+ rating

---

## Resources

**Tools:**
- OWASP ZAP: https://www.zaproxy.org/
- Snyk: https://snyk.io/
- npm audit: Built-in
- Security Headers: https://securityheaders.com/
- SSL Labs: https://www.ssllabs.com/

**Documentation:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Firebase Security: https://firebase.google.com/docs/rules
- React Security: https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml

---

## Contact & Support

For security concerns or questions:
- Create GitHub issue (for non-sensitive matters)
- Email security team (for vulnerabilities)
- Review documentation in `/docs/security/`

---

**Document Version:** 1.0
**Last Updated:** 2025-10-22
**Next Review:** 2025-11-22
