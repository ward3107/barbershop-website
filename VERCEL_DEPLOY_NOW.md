# Deploy to Vercel - Quick Start Guide

Follow these steps to deploy your barbershop website to Vercel in under 5 minutes!

## Step 1: Get Your Firebase Credentials First

Before deploying, you need Firebase credentials. This is the ONLY required setup.

### Option A: Use Existing Firebase Project (If you have one)
1. Go to https://console.firebase.google.com
2. Select your project
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll to "Your apps" section
5. If you see a web app, click it to see config
6. If no web app exists, click **</>** (web icon) to create one
7. Copy these 6 values:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

### Option B: Create New Firebase Project (If you don't have one)
1. Go to https://console.firebase.google.com
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `shokha-barbershop` (or any name you like)
4. **Disable** Google Analytics (not needed)
5. Click **"Create project"** and wait ~30 seconds
6. Once created, follow **Option A** steps 3-7 above

**Save these 6 values - you'll need them in Step 3!**

---

## Step 2: Sign Up / Login to Vercel

1. Go to **https://vercel.com**
2. Click **"Sign Up"** (top right)
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account
5. You'll be redirected to your Vercel dashboard

---

## Step 3: Import Your Project

1. On Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see "Import Git Repository" section
3. If this is your first time:
   - Click **"Adjust GitHub App Permissions"** or **"Add GitHub Account"**
   - Select your GitHub account (`ward3107`)
   - Grant access to repositories
4. Find and select: **`barbershop-website`**
5. Click **"Import"**

---

## Step 4: Configure Project

Vercel will show a configuration screen:

### Build Settings (Already Correct - Don't Change!)
- **Framework Preset:** Vite ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅
- **Install Command:** `npm install` ✅

These are auto-detected from your `vercel.json` file - perfect!

### Environment Variables (ADD THESE!)

Click **"Environment Variables"** dropdown and add these 6 variables:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key from Step 1 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain (e.g., `shokha-xxxxx.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket (e.g., `shokha-xxxxx.appspot.com`) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID (numbers) |
| `VITE_FIREBASE_APP_ID` | Your Firebase App ID (e.g., `1:123456789012:web:abc123`) |

**Important:**
- Make sure each variable name is EXACTLY as shown (with `VITE_` prefix)
- Paste values WITHOUT quotes
- Click the ✓ or "Add" button after each one

---

## Step 5: Deploy!

1. Click **"Deploy"** button (bottom right)
2. Vercel will:
   - Clone your repository
   - Install dependencies (~30 seconds)
   - Build your website (~20 seconds)
   - Deploy to global CDN (~10 seconds)
3. Wait for "Congratulations!" message (total time: ~1 minute)

---

## Step 6: Get Your Live URL

After deployment completes:

1. You'll see a **preview image** of your site
2. Click **"Continue to Dashboard"**
3. Your live URL is shown at the top (e.g., `https://barbershop-website-xxxxx.vercel.app`)
4. Click the URL to open your live website! 🎉

**Your website is now LIVE on the internet!**

---

## Step 7: Enable Firebase Authentication (Required for Login)

Your website needs Firebase Auth enabled:

1. Go back to https://console.firebase.google.com
2. Select your project
3. Click **"Authentication"** in left sidebar
4. Click **"Get started"**
5. Click **"Email/Password"** provider
6. Toggle **"Enable"** switch to ON
7. Click **"Save"**

Now users can sign up and login! ✅

---

## Step 8: Create Firestore Database (Required for Bookings)

1. In Firebase Console, click **"Firestore Database"** in left sidebar
2. Click **"Create database"**
3. Choose **"Start in production mode"**
4. Select location: **europe-west1** (closest to Israel)
5. Click **"Enable"**
6. Wait ~30 seconds for database creation
7. Go to **"Rules"** tab
8. Replace the rules with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create bookings (for customer booking form)
    match /bookings/{bookingId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

9. Click **"Publish"**

Now your booking system works! ✅

---

## Step 9: Create Your Admin Account

1. Open your live website (the Vercel URL from Step 6)
2. Click **"Sign Up"** and create an account
3. Go back to Firebase Console → Firestore Database
4. Click **"users"** collection
5. Find your user document (your email)
6. Click **"Add field"**:
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true` (checked)
7. Click **"Save"**

Now you can access the admin panel! ✅

---

## Step 10: Configure Authorized Domain (Important!)

Firebase needs to know your Vercel domain:

1. In Firebase Console → **Authentication**
2. Click **"Settings"** tab → **"Authorized domains"**
3. Click **"Add domain"**
4. Paste your Vercel domain (e.g., `barbershop-website-xxxxx.vercel.app`)
5. Click **"Add"**

Now Firebase authentication will work on your live site! ✅

---

## 🎉 You're Done! Your Website is Live!

### What works now:
- ✅ Website accessible worldwide via HTTPS
- ✅ User sign up / login
- ✅ Booking system (saves to Firestore)
- ✅ Admin panel (for managing bookings)
- ✅ Automatic deploys on every Git push
- ✅ All security features active

### Your URLs:
- **Live Website:** Check your Vercel dashboard for the URL
- **Admin Panel:** `your-vercel-url.vercel.app/admin` (login with your account)

---

## Optional: Add Custom Domain

Want to use your own domain (e.g., `shokha.com`)?

1. In Vercel dashboard → Your project → **"Settings"** → **"Domains"**
2. Enter your domain name
3. Follow DNS instructions
4. Don't forget to add the custom domain to Firebase authorized domains too!

---

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase → Authentication → Settings → Authorized domains
- Add your Vercel domain

### "Environment validation failed"
- Check all 6 `VITE_FIREBASE_*` variables are set in Vercel
- Go to Vercel → Your project → Settings → Environment Variables
- Make sure no typos in variable names

### Website shows error on load
- Open browser console (F12) to see the error
- Most likely: Forgot to enable Firebase Authentication or create Firestore database

### Can't access admin panel
- Make sure you set `isAdmin: true` in Firestore for your user
- Refresh the page after setting admin

---

## Need Help?

- Check browser console (F12) for errors
- Check Vercel deployment logs (in Vercel dashboard)
- Check Firebase Console for configuration issues

---

**Ready to deploy? Start with Step 1!** 🚀

Once you're live, share your URL with your customers!
