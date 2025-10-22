# How To Test Your Website

**Quick Start Guide for Testing Security Improvements**

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Check Your Environment Setup

```bash
# 1. Make sure you're in the project directory
cd /home/user/barbershop-website

# 2. Check if .env file exists
ls -la .env

# If .env doesn't exist, create it:
cp .env.example .env
```

### Step 2: Configure Firebase (Required)

Open `.env` file and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Where to get these?**
1. Go to https://console.firebase.google.com/
2. Select your project (or create one)
3. Click ⚙️ Settings → Project Settings
4. Scroll down to "Your apps" → Web app
5. Copy all the values

### Step 3: Add Owner Contact (Optional but Recommended)

In your `.env` file:

```env
# Your WhatsApp number (without + sign)
VITE_OWNER_WHATSAPP=972501234567

# Your phone number
VITE_OWNER_PHONE=972501234567
```

### Step 4: Start the Development Server

```bash
# Install dependencies if you haven't already
npm install

# Start the dev server
npm run dev
```

You should see:
```
✅ Environment variables validated successfully

  VITE v5.1.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 5: Open in Browser

Open your browser and go to: **http://localhost:5173/**

---

## ✅ Testing Checklist

### 1. Test Environment Validation ✅

**What to test:** App should validate environment variables on startup

**How to test:**
```bash
# Try starting with missing Firebase config
# Temporarily rename .env
mv .env .env.backup

# Start the app
npm run dev

# You should see a red error screen with:
# "⚠️ Configuration Error"
# "The application is not properly configured"

# Restore .env
mv .env.backup .env
npm run dev
```

**Expected:** Red error screen when env vars missing ✅

---

### 2. Test Password Strength ✅

**What to test:** New password requirements and strength indicator

**How to test:**
1. Go to http://localhost:5173/
2. Click "Sign Up" or login button
3. Click "Don't have an account? Sign up"
4. Enter a name and email
5. Start typing a password

**Test these passwords:**
- `12345678` - Should show "Weak" (no uppercase/special)
- `Password` - Should show "Weak" (no number/special)
- `Password123` - Should show "Medium" (no special char)
- `Password123!` - Should show "Strong" ✅

**Expected:**
- Real-time strength indicator appears
- Shows colored progress bar
- Lists 5 requirements with check marks
- Only strong passwords can be submitted ✅

---

### 3. Test XSS Protection ✅

**What to test:** Booking notifications don't allow script injection

**How to test:**
1. Create a test booking with malicious input:
   - Name: `<script>alert('XSS')</script>`
   - Phone: `<img src=x onerror="alert('XSS')">`
2. Submit the booking
3. Check if any alerts pop up

**Expected:**
- NO alerts should appear
- Text is displayed as plain text (not executed)
- React automatically escapes the input ✅

---

### 4. Test Secure Booking IDs ✅

**What to test:** Booking IDs are now random UUIDs

**How to test:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Create a few test bookings
4. Check the console logs

**Expected:**
- Booking IDs look like: `550e8400-e29b-41d4-a716-446655440000`
- NOT like: `booking-1729612800000-abc123` ✅

---

### 5. Test Protected Routes (If Implemented) ✅

**What to test:** Admin pages require authentication

**How to test:**
1. Make sure you're logged OUT
2. Try to access admin page (if you have one set up)
3. You should see "Authentication Required" screen

**Then:**
1. Log in with a regular user account
2. Try to access admin page
3. You should see "Access Denied" (not admin)

**Expected:**
- Unauthenticated users redirected
- Non-admin users see "Access Denied" ✅

---

### 6. Test Input Validation (When Integrated) ✅

**What to test:** Booking form validates inputs

**Test these invalid inputs:**
- Phone: `123` (too short)
- Phone: `abcd` (not a number)
- Email: `notanemail` (invalid format)
- Name: `@#$%` (invalid characters)

**Expected:**
- Clear error messages
- Form won't submit with invalid data ✅

---

### 7. Test No Credentials in Console/Storage ✅

**What to test:** No sensitive data exposed

**How to test:**
1. Open DevTools (F12)
2. Go to Application → Local Storage
3. Check all stored data

**Expected:**
- NO passwords or tokens in localStorage
- NO Twilio credentials visible
- Only booking data and user preferences ✅

---

### 8. Test PII Redaction in Logs ✅

**What to test:** Logger redacts sensitive information

**How to test:**
1. Open DevTools Console (F12)
2. Look at any logs that mention customer data
3. Check if phone numbers/emails are redacted

**Expected:**
- Phone numbers show as `[PHONE_REDACTED]`
- Emails show as `[EMAIL_REDACTED]`
- Passwords never logged ✅

---

## 🔧 Testing Individual Features

### Test Authentication Flow

```bash
# 1. Sign Up
- Click "Sign Up"
- Enter valid details with strong password
- Submit
- Should create account and log in

# 2. Log Out
- Click user menu
- Click "Logout"
- Should return to homepage

# 3. Log In
- Click "Login"
- Enter credentials
- Should log in successfully

# 4. Google Login
- Click "Continue with Google"
- Follow Google OAuth flow
- Should create/login account
```

### Test Booking Flow

```bash
# 1. Create Booking
- Click "Book Now"
- Fill in all fields:
  * Name: John Doe
  * Phone: 0501234567
  * Service: Classic Haircut
  * Date: Tomorrow
  * Time: 14:00
- Submit

# 2. Check Notifications
- WhatsApp should open (if configured)
- Browser notification (if permitted)
- Booking appears in dashboard

# 3. Verify Booking ID
- Check console logs
- Should see UUID format
```

### Test Admin Features (if user is admin)

```bash
# 1. Access Admin Dashboard
- Log in as admin user
- Navigate to /admin
- Should see pending bookings

# 2. Approve/Reject Bookings
- Click "Approve" on a booking
- WhatsApp should open with approval message
- Status changes to "Approved"

# 3. Non-Admin Access
- Log in as regular user
- Try to access /admin
- Should see "Access Denied"
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Configuration Error" Red Screen

**Problem:** Missing or invalid environment variables

**Fix:**
```bash
# 1. Check .env file exists
ls .env

# 2. Verify Firebase credentials are filled in
cat .env | grep VITE_FIREBASE

# 3. Make sure no values contain "YOUR_" or "your_"
# 4. Restart dev server
npm run dev
```

### Issue 2: "Firebase: Error (auth/...)"

**Problem:** Firebase authentication issue

**Fix:**
1. Go to Firebase Console
2. Authentication → Sign-in method
3. Enable "Email/Password"
4. Enable "Google" (optional)
5. Save and retry

### Issue 3: WhatsApp Doesn't Open

**Problem:** Owner WhatsApp not configured

**Fix:**
```bash
# Add to .env
VITE_OWNER_WHATSAPP=972501234567

# Restart server
npm run dev
```

### Issue 4: Password Strength Not Showing

**Problem:** Component might not be imported

**Fix:**
- Check browser console for errors
- Make sure you're on the Sign Up form (not Login)
- Clear browser cache and reload

### Issue 5: "Module not found: zod"

**Problem:** Dependencies not installed

**Fix:**
```bash
npm install
npm run dev
```

---

## 📱 Mobile Testing

### Test on Mobile Device

**Option 1: Network Access**
```bash
# Start server with network access
npm run dev -- --host

# You'll see:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://192.168.1.100:5173/

# Open the Network URL on your phone
```

**Option 2: Ngrok (for internet access)**
```bash
# Install ngrok: https://ngrok.com/
npx ngrok http 5173

# Use the provided URL on any device
```

---

## 🔍 Security Testing

### Test 1: Try XSS Injection
```javascript
// Try these in booking form:
<script>alert('XSS')</script>
<img src=x onerror="alert('XSS')">
javascript:alert('XSS')

// Expected: All displayed as plain text, not executed
```

### Test 2: Check for Exposed Secrets
```bash
# Open DevTools → Network tab
# Look at any request
# Check if credentials are in headers/payload
# Expected: No auth tokens or passwords visible
```

### Test 3: Test Rate Limiting (Webhook)
```bash
# Make multiple rapid requests to webhook
# Expected: After 10 requests/minute, get 429 error
```

---

## 📊 Performance Testing

### Check Load Time
```bash
# Open DevTools → Network tab
# Reload page (Ctrl+Shift+R)
# Check "Load" time at bottom

# Should be:
# - Development: < 2 seconds
# - Production: < 1 second
```

### Check Bundle Size
```bash
# Build for production
npm run build

# Check dist folder size
du -sh dist/

# Should be < 2MB total
```

---

## ✅ Final Checklist Before Going Live

- [ ] All environment variables configured in production
- [ ] Firebase authentication enabled (Email + Google)
- [ ] Owner WhatsApp number configured
- [ ] Tested sign up with strong password
- [ ] Tested login/logout
- [ ] Tested booking creation
- [ ] Verified no credentials in console/localStorage
- [ ] Tested on mobile device
- [ ] All security checks passed
- [ ] Performance is acceptable

---

## 🆘 Need Help?

### Check These First:
1. Browser console (F12) for errors
2. Terminal where `npm run dev` is running
3. `.env` file has correct values
4. Dependencies installed (`npm install`)

### Documentation:
- `SECURITY_IMPROVEMENTS.md` - Features overview
- `SECURITY_CHECKLIST.md` - Deployment checklist
- `SECURITY_REMEDIATION_PLAN.md` - Detailed implementation

### Common Commands:
```bash
# Restart server
npm run dev

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm run build

# Run with more verbose logging
npm run dev -- --debug
```

---

**Happy Testing! 🚀**

Your website now has enterprise-grade security. Take your time testing each feature to ensure everything works perfectly before going live.
