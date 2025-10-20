# Firebase Setup Guide for SHOKHA Barbershop

This guide will walk you through setting up Firebase for your barbershop website to enable customer accounts, booking management, and loyalty rewards.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `shokha-barbershop` (or your preferred name)
4. Disable Google Analytics (optional, you can enable it if you want)
5. Click "Create project"

## Step 2: Add Web App to Your Firebase Project

1. In your Firebase project, click the **web icon** (`</>`) to add a web app
2. Register your app with a nickname: `SHOKHA Website`
3. **DO NOT** check "Also set up Firebase Hosting" (unless you want to use Firebase Hosting)
4. Click "Register app"
5. **Copy the Firebase configuration** - you'll need these values later

The configuration will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "shokha-barbershop.firebaseapp.com",
  projectId: "shokha-barbershop",
  storageBucket: "shokha-barbershop.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

## Step 3: Enable Authentication

1. In Firebase Console, go to **Build** > **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable the following providers:

### Email/Password Authentication:
- Click on "Email/Password"
- Toggle "Enable"
- Click "Save"

### Google Authentication (Recommended):
- Click on "Google"
- Toggle "Enable"
- Enter a support email (your email)
- Click "Save"

## Step 4: Create Firestore Database

1. In Firebase Console, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **"Start in production mode"** (we'll add security rules later)
4. Select a location close to your users (e.g., `europe-west2` for Israel/Middle East region)
5. Click "Enable"

## Step 5: Set Up Firestore Security Rules

1. In Firestore Database, go to the **Rules** tab
2. Replace the existing rules with these:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Bookings collection - users can read their own bookings, admins can read all
    match /bookings/{bookingId} {
      allow read: if request.auth != null &&
                   (resource.data.userId == request.auth.uid ||
                    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Admin-only collections
    match /admin/{document=**} {
      allow read, write: if request.auth != null &&
                          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. Click "Publish"

## Step 6: Configure Environment Variables

1. In your project root, create a `.env` file (if it doesn't exist)
2. Copy the values from your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=shokha-barbershop.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shokha-barbershop
VITE_FIREBASE_STORAGE_BUCKET=shokha-barbershop.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

3. **IMPORTANT**: Add `.env` to your `.gitignore` to prevent exposing secrets:

```
# .gitignore
.env
.env.local
.env.production
```

## Step 7: Initialize Firestore Collections (Optional)

You can manually create the initial structure:

1. Go to **Firestore Database** > **Data** tab
2. Click "Start collection"
3. Create these collections:

### `users` Collection:
```
Document ID: [auto-generated]
Fields:
  - uid: string
  - email: string
  - displayName: string
  - phone: string
  - loyaltyPoints: number (default: 0)
  - totalBookings: number (default: 0)
  - createdAt: timestamp
```

### `bookings` Collection:
```
Document ID: [auto-generated]
Fields:
  - userId: string
  - customerName: string
  - customerEmail: string
  - customerPhone: string
  - service: string
  - date: timestamp
  - time: string
  - status: string (pending/approved/rejected)
  - createdAt: timestamp
  - notes: string (optional)
```

## Step 8: Test Your Setup

1. Restart your development server:
```bash
npm run dev
```

2. Visit your website
3. Click on the User icon in the navigation
4. Try creating an account
5. Check Firebase Console > Authentication to see the new user
6. Check Firestore Database to see the user profile created

## Step 9: Create Admin User (Optional)

To make a user an admin:

1. Go to **Firestore Database**
2. Find your user in the `users` collection
3. Click on the document
4. Add a new field:
   - Field: `isAdmin`
   - Type: `boolean`
   - Value: `true`
5. Save

Now this user will have admin privileges!

## Features Enabled

Once Firebase is set up, your website will have:

✅ **Customer Accounts**
- Email/password registration
- Google sign-in
- User profiles with personal information

✅ **Booking History**
- View all past and upcoming bookings
- Track booking status (pending, approved, rejected)
- Rebook previous appointments

✅ **Loyalty Rewards**
- Earn 10 points per completed appointment
- Track total points
- View available rewards
- Redeem rewards (coming soon)

✅ **Secure Data Storage**
- All bookings stored in Firestore
- User data protected by security rules
- Real-time synchronization

## Troubleshooting

### "Firebase not defined" error
- Make sure you've created the `.env` file with all Firebase credentials
- Restart your dev server after creating `.env`

### "Permission denied" errors in Firestore
- Check your Firestore security rules
- Make sure users are authenticated before accessing data
- Verify the admin flag is set correctly

### Google Sign-In not working
- Make sure you enabled Google provider in Authentication
- Add your domain to Firebase authorized domains:
  - Go to Authentication > Settings > Authorized domains
  - Add `localhost` and your production domain

### Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add all `VITE_FIREBASE_*` environment variables to your hosting platform
2. Add your production domain to Firebase authorized domains
3. Update Firestore security rules if needed

## Next Steps

- Set up email notifications (Firebase Cloud Functions)
- Implement appointment reminders
- Add SMS notifications via Twilio
- Create admin dashboard with Firebase Admin SDK

## Support

For Firebase documentation:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
