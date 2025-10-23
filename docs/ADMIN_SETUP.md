# Admin & Owner Role Setup Guide

This guide explains how to grant admin and owner privileges to users in the SHOKHA Barbershop application.

## 🔒 Security Model

The application now uses **role-based access control (RBAC)** instead of hardcoded passwords:

- **User Role**: Default role for all new users (can book appointments, view their bookings)
- **Admin Role**: Can access the admin dashboard to approve/reject bookings
- **Owner Role**: Can access both admin and owner dashboards with full control

## 📋 Prerequisites

1. Firebase project set up
2. Firestore database enabled
3. Firebase CLI installed (optional, for easier management)

## 🛠️ Methods to Grant Roles

### Method 1: Using Firebase Console (Recommended for Beginners)

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Database**
   - Click on "Firestore Database" in the left sidebar
   - Find the `users` collection

3. **Find the User**
   - Click on the `users` collection
   - Find the user document by their UID (User ID)
   - Alternatively, search by email in the document data

4. **Add/Edit the `role` field**
   - Click on the user document
   - Add or edit the `role` field:
     - For Admin: Set `role` to `admin`
     - For Owner: Set `role` to `owner`
   - Click "Update"

5. **Verify**
   - The user must log out and log back in for changes to take effect
   - They should now have access to the respective dashboard

### Method 2: Using Firebase CLI

```bash
# Install Firebase tools if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore security rules (optional, see below)
firebase deploy --only firestore:rules
```

### Method 3: Programmatic Approach (Backend Script)

Create a Node.js script to grant roles:

```javascript
// grant-role.js
const admin = require('firebase-admin');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();

async function grantRole(email, role) {
  try {
    // Find user by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();

    if (snapshot.empty) {
      console.log(`❌ User not found: ${email}`);
      return;
    }

    // Update user role
    const userDoc = snapshot.docs[0];
    await userDoc.ref.update({ role });

    console.log(`✅ Successfully granted ${role} role to ${email}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Usage examples:
grantRole('admin@shokhabarbershop.com', 'admin');
grantRole('owner@shokhabarbershop.com', 'owner');
```

Run the script:
```bash
node grant-role.js
```

### Method 4: Manual Firestore Document Update

If you have the user's UID, you can update directly:

```javascript
// In Firebase Console > Firestore Database > users > [UID]
{
  "role": "admin"  // or "owner"
}
```

## 🔐 Firestore Security Rules

Add these security rules to protect admin/owner data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper function to check if user is admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Helper function to check if user is owner
    function isOwner() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'owner';
    }

    // Helper function to check if user is admin or owner
    function isAdminOrOwner() {
      return isAdmin() || isOwner();
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;

      // Users can create their own profile (signup)
      allow create: if request.auth != null && request.auth.uid == userId;

      // Users can update their own profile (but NOT their role)
      allow update: if request.auth != null &&
                      request.auth.uid == userId &&
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'isAdmin', 'isOwner']);

      // Only owner can update user roles
      allow update: if isOwner();
    }

    // Bookings collection
    match /bookings/{bookingId} {
      // Anyone can read their own bookings
      allow read: if request.auth != null &&
                    (resource.data.userId == request.auth.uid || isAdminOrOwner());

      // Any authenticated user can create a booking
      allow create: if request.auth != null;

      // Users can cancel their own bookings
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;

      // Admin/Owner can update any booking (approve, reject, complete)
      allow update, delete: if isAdminOrOwner();
    }
  }
}
```

Save these rules in `firestore.rules` and deploy:

```bash
firebase deploy --only firestore:rules
```

## 🎯 Quick Start for First-Time Setup

### Option A: Grant Role via Firebase Console (Easiest)

1. Create a user account by signing up on the website
2. Note the email address you used
3. Go to Firebase Console > Firestore Database > `users` collection
4. Find the user with that email
5. Edit the document and add field: `role: "owner"`
6. Log out and log back in on the website
7. Access `/owner` or `/admin` route

### Option B: Create Owner Account Directly in Firestore

1. Sign up on the website first (this creates the user document)
2. In Firebase Console, edit your user document:
   ```json
   {
     "uid": "your-user-id",
     "email": "owner@example.com",
     "displayName": "Owner Name",
     "phone": "+972...",
     "role": "owner",
     "isAdmin": false,
     "isOwner": true,
     "loyaltyPoints": 0,
     "totalBookings": 0,
     "createdAt": "[Firestore timestamp]"
   }
   ```

## 🚨 Important Security Notes

1. **Never expose role assignment in the frontend**
   - Role changes should only be done through Firestore Console or backend scripts
   - The frontend only reads roles, never writes them

2. **Protect the Firestore security rules**
   - Ensure only owners can modify user roles
   - Test your security rules before deploying

3. **Audit role changes**
   - Keep track of who has admin/owner access
   - Regularly review user roles in Firestore

4. **Use Firebase Authentication**
   - All users must be authenticated via Firebase Auth
   - No hardcoded passwords in the frontend

## 🔍 Troubleshooting

### "Access Denied" after granting role

**Solution:**
- Log out and log back in (the app caches user profile data)
- Clear browser cache and cookies
- Check that the `role` field is exactly `"admin"` or `"owner"` (case-sensitive)

### User can't access admin/owner dashboard

**Checklist:**
1. ✅ User is logged in (check Firebase Auth console)
2. ✅ User document exists in Firestore `users` collection
3. ✅ `role` field is set to `"admin"` or `"owner"`
4. ✅ User has logged out and back in since role was granted
5. ✅ Firestore security rules allow reading user profiles

### Role field not saving

**Possible causes:**
- Firestore security rules are too restrictive
- User document doesn't exist (sign up first)
- Typo in field name (should be exactly `role`)

## 📞 Support

If you encounter issues:
1. Check Firebase Console logs
2. Check browser console for errors
3. Verify Firestore security rules
4. Ensure Firebase config is correct in `.env`

## 🔄 Migration from Old Password System

If you previously used the password-based system:

1. **Remove old environment variables**
   - Delete `VITE_ADMIN_PASSWORD` and `VITE_OWNER_PASSWORD` from `.env`

2. **Sign up for accounts**
   - Create accounts using Firebase Auth signup

3. **Grant roles**
   - Follow Method 1 above to grant admin/owner roles

4. **Test access**
   - Log in with the new accounts
   - Verify admin/owner dashboard access

## 📚 Related Documentation

- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
