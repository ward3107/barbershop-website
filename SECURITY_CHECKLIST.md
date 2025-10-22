# Security Deployment Checklist

**Version:** 1.0
**Last Updated:** 2025-10-22

Use this checklist before deploying to production.

---

## ✅ Critical Security Fixes (COMPLETED)

- [x] **XSS Vulnerability Fixed** - NotificationManager.tsx now uses React Portal instead of innerHTML
- [x] **Hardcoded Credentials Removed** - All placeholder values replaced with environment variables
- [x] **LocalStorage Credential Storage Removed** - Twilio and Make.com config no longer stored in localStorage
- [x] **Environment Validation Added** - App validates environment variables on startup
- [x] **Secure Booking IDs** - Using crypto.randomUUID() instead of predictable Date.now()

---

## 🔧 Pre-Deployment Configuration

### Required Environment Variables
- [ ] `VITE_FIREBASE_API_KEY` - Set from Firebase Console
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` - Set from Firebase Console
- [ ] `VITE_FIREBASE_PROJECT_ID` - Set from Firebase Console
- [ ] `VITE_FIREBASE_STORAGE_BUCKET` - Set from Firebase Console
- [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID` - Set from Firebase Console
- [ ] `VITE_FIREBASE_APP_ID` - Set from Firebase Console

### Optional Environment Variables (for features)
- [ ] `VITE_TWILIO_ACCOUNT_SID` - If using Twilio WhatsApp
- [ ] `VITE_TWILIO_AUTH_TOKEN` - If using Twilio WhatsApp
- [ ] `VITE_TWILIO_WHATSAPP_NUMBER` - If using Twilio WhatsApp
- [ ] `VITE_OWNER_WHATSAPP` - Owner WhatsApp number (without +)
- [ ] `VITE_OWNER_PHONE` - Owner phone number
- [ ] `VITE_MAKE_WEBHOOK_URL` - If using Make.com automation
- [ ] `VITE_TELEGRAM_BOT_TOKEN` - If using Telegram notifications
- [ ] `VITE_TELEGRAM_CHAT_ID` - If using Telegram notifications
- [ ] `VITE_EMAILJS_SERVICE_ID` - If using EmailJS
- [ ] `VITE_EMAILJS_TEMPLATE_ID` - If using EmailJS
- [ ] `VITE_EMAILJS_USER_ID` - If using EmailJS
- [ ] `VITE_OWNER_EMAIL` - Owner email address
- [ ] `VITE_HCAPTCHA_SITE_KEY` - If using hCaptcha

---

## 🔒 Security Configuration

### Firebase Security Rules
- [ ] Firebase Security Rules deployed (see SECURITY_REMEDIATION_PLAN.md Phase 3.3)
- [ ] Firestore rules restrict read/write access appropriately
- [ ] Authentication rules configured

### HTTPS & Headers
- [ ] HTTPS enforced on hosting platform
- [ ] Security headers configured (see netlify.toml)
- [ ] HSTS header enabled
- [ ] Content-Security-Policy configured

### API Security
- [ ] Twilio credentials moved to backend (or acknowledged as development-only)
- [ ] Firebase API keys configured with appropriate restrictions
- [ ] Webhook signature verification implemented (if using webhooks)

---

## 🧪 Testing

### Security Testing
- [ ] Test XSS prevention with malicious input: `<script>alert('XSS')</script>`
- [ ] Verify no credentials visible in browser DevTools
- [ ] Verify no credentials in localStorage
- [ ] Test environment validation (try starting with missing .env)
- [ ] Verify booking IDs are random UUIDs

### Functional Testing
- [ ] Booking creation works
- [ ] WhatsApp notifications work (if configured)
- [ ] Authentication works (login/signup)
- [ ] Admin dashboard accessible only to authorized users
- [ ] All forms validate input properly

---

## 🚫 Cleanup

### Remove Development/Test Code
- [ ] TestNotificationButton removed from production build (if not needed)
- [ ] All console.log statements reviewed and removed/redacted
- [ ] Debug flags disabled
- [ ] Test data cleared from localStorage

### Code Cleanup
- [ ] No `YOUR_*` or `XXXXXXXXX` placeholders in code
- [ ] No hardcoded credentials anywhere
- [ ] No commented-out sensitive code
- [ ] .gitignore includes .env files

---

## 📊 Verification

### Run These Commands
```bash
# 1. Check for placeholder values
grep -r "YOUR_" src/
grep -r "XXXXXXXXX" src/

# 2. Check for hardcoded credentials
grep -r "localStorage.setItem.*config" src/

# 3. Check for innerHTML usage
grep -r "innerHTML" src/

# 4. Run build
npm run build

# 5. Check environment variables
# Ensure all required vars are set in hosting platform
```

---

## ⚠️ Known Security Limitations (Address Before Production)

### High Priority
- [ ] **Twilio credentials still client-side** - Move to backend API
- [ ] **No rate limiting** - Implement on backend
- [ ] **No CAPTCHA** - Add to booking form
- [ ] **Weak password requirements** - Strengthen (see Phase 2.3 in SECURITY_REMEDIATION_PLAN.md)
- [ ] **No webhook signature verification** - Implement (see Phase 1.5 in SECURITY_REMEDIATION_PLAN.md)

### Medium Priority
- [ ] Input validation with Zod schemas (see Phase 2.1 in SECURITY_REMEDIATION_PLAN.md)
- [ ] Protected routes for admin (see Phase 2.4 in SECURITY_REMEDIATION_PLAN.md)
- [ ] CSRF protection
- [ ] Better error handling (don't expose internals)
- [ ] Logging with PII redaction

---

## 📝 Documentation

- [ ] README.md updated with deployment instructions
- [ ] Environment variables documented in .env.example
- [ ] Security guidelines shared with team
- [ ] Incident response plan created

---

## 🎯 Post-Deployment

### Monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor Firebase usage/costs
- [ ] Monitor Twilio usage/costs
- [ ] Set up alerts for failed authentications
- [ ] Monitor API rate limits

### Regular Maintenance
- [ ] Schedule monthly dependency updates
- [ ] Schedule quarterly security audits
- [ ] Review Firebase Security Rules monthly
- [ ] Monitor for new CVEs

---

## 📞 Emergency Contacts

In case of security incident:
1. Disable affected features immediately
2. Review logs for unauthorized access
3. Rotate all credentials
4. Notify affected users if data breach

---

## Sign-Off

**Deployed By:** _________________
**Date:** _________________
**Environment:** [ ] Development [ ] Staging [ ] Production
**All Critical Items Completed:** [ ] Yes [ ] No

**Notes:**
_______________________________________________
_______________________________________________
_______________________________________________
