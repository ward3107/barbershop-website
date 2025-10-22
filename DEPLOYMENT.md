# Deployment Guide - Shokha Barbershop Website

This guide will help you deploy your barbershop website to production.

## Quick Deploy (Easiest Method) - Vercel

### Step 1: Push Your Code to GitHub
Your code is already on GitHub at: `ward3107/barbershop-website`

### Step 2: Deploy with Vercel (Free Hosting)

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login**: Use your GitHub account for easiest setup
3. **Import Project**:
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose `ward3107/barbershop-website`
4. **Configure Project**:
   - Vercel will auto-detect settings from `vercel.json`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - No changes needed - all configured!

5. **Add Environment Variables**:
   Click "Environment Variables" and add the following:

   ```
   VITE_FIREBASE_API_KEY=your_actual_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid
   VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token
   VITE_TWILIO_PHONE_NUMBER=whatsapp:+972XXXXXXXXXX
   VITE_OWNER_WHATSAPP=whatsapp:+972XXXXXXXXXX
   VITE_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   VITE_TELEGRAM_CHAT_ID=your_telegram_chat_id
   VITE_WEBHOOK_SECRET=your_secure_random_string_here
   ```

   **IMPORTANT**: Replace all `your_*` values with real credentials!

6. **Deploy**: Click "Deploy"
   - Vercel will build and deploy your site
   - You'll get a live URL like: `https://your-site.vercel.app`

### Step 3: Done!
Your website is now live and will auto-deploy on every push to your repository.

---

## Alternative: Deploy with Netlify

1. **Go to Netlify**: https://netlify.com
2. **Sign up/Login**: Use your GitHub account
3. **Import Project**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select `ward3107/barbershop-website`
4. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add the same environment variables as above
5. **Deploy**: Click "Deploy site"

---

## Deploy via CLI (For Advanced Users)

### Using Vercel CLI

```bash
# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Using Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

---

## Setting Up Firebase (Required for Full Functionality)

Your website uses Firebase for authentication and database. You need to:

### 1. Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it (e.g., "shokha-barbershop")
4. Disable Google Analytics (optional)

### 2. Enable Authentication
1. In Firebase Console → Authentication
2. Click "Get started"
3. Enable "Email/Password" sign-in method

### 3. Create Firestore Database
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose a location (closest to Israel)

### 4. Configure Security Rules
Go to Firestore → Rules and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }

    // Admin-only collections
    match /settings/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

### 5. Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app (name: "Shokha Website")
4. Copy the configuration values
5. Use these as your `VITE_FIREBASE_*` environment variables

### 6. Create Your First Admin User
After deploying and signing up:
1. Go to Firebase Console → Firestore
2. Find your user document in the `users` collection
3. Add field: `isAdmin` = `true`
4. Save

---

## Setting Up Twilio (For SMS/WhatsApp Notifications)

### 1. Create Twilio Account
1. Go to https://www.twilio.com/try-twilio
2. Sign up for free trial (includes $15 credit)

### 2. Get Phone Number
1. In Twilio Console → Phone Numbers
2. Buy a WhatsApp-enabled number or use sandbox

### 3. Enable WhatsApp
1. Go to Messaging → Try it out → WhatsApp
2. Follow sandbox setup instructions

### 4. Get Credentials
1. Account SID: Dashboard → Account Info
2. Auth Token: Dashboard → Account Info (click to reveal)
3. Phone Number: Your purchased number

---

## Setting Up Telegram Bot (For Telegram Notifications)

### 1. Create Bot
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Save the **Bot Token**

### 2. Get Chat ID
1. Add your bot to a group or message it
2. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Find `"chat":{"id":` - that's your Chat ID

---

## Post-Deployment Checklist

- [ ] Website loads without errors
- [ ] Firebase authentication works (sign up/login)
- [ ] Booking system creates bookings in Firestore
- [ ] Admin panel is accessible (after setting isAdmin=true)
- [ ] Notifications are being sent (SMS/WhatsApp/Telegram)
- [ ] Environment variables are all set correctly
- [ ] HTTPS is enabled (auto by Vercel/Netlify)
- [ ] Custom domain configured (optional)

---

## Troubleshooting

### "Environment validation failed"
- Check that all `VITE_*` environment variables are set
- Ensure no values contain "YOUR_", "Example", or "Replace"
- Values must not be empty, "undefined", or "null"

### Firebase errors
- Verify Firebase config in environment variables
- Check Firebase Console for project status
- Ensure Firestore rules are published

### Build fails
- Run `npm run build` locally to see full errors
- Check that all dependencies are installed
- Verify TypeScript has no errors

### Notifications not working
- Check Twilio/Telegram credentials
- Verify phone numbers are in correct format
- Check browser console for errors

---

## Getting Help

If you encounter issues:
1. Check the browser console for errors (F12)
2. Review the deployment logs in Vercel/Netlify dashboard
3. Verify all environment variables are correct
4. Check Firebase Console for authentication/database errors

---

## Security Notes

- ✅ Never commit `.env` files to Git
- ✅ Always use environment variables for secrets
- ✅ Keep Firebase security rules strict
- ✅ Use HTTPS only (auto by Vercel/Netlify)
- ✅ Regularly update dependencies
- ✅ Monitor for security vulnerabilities

Your website includes security features:
- XSS protection via React Portal
- Input validation with Zod schemas
- PII redaction in logs
- Webhook signature verification
- Password strength requirements
- Protected admin routes
- Secure booking ID generation

---

**Ready to deploy? Start with Vercel - it's the easiest option!**

🚀 Your website will be live in under 5 minutes!
