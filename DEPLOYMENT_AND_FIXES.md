# Deployment and Google Login Troubleshooting

## ✅ Changes Completed

1. **Removed Facebook, Apple, and Microsoft login buttons** from the AuthModal
2. **Only Google sign-in now appears** in the login/signup modal
3. **Code committed and pushed to GitHub** (commit: 8e499c5)

---

## 🚀 How to Deploy to Netlify

### Option 1: Automatic Deployment (Recommended)

Your Netlify site is at: https://shokhabarber.netlify.app/

**To enable automatic deployment from GitHub:**

1. Go to https://app.netlify.com/
2. Log in to your account
3. Click on your site "shokhabarber"
4. Go to **Site configuration** → **Build & deploy** → **Continuous deployment**
5. Click **Link repository**
6. Select **GitHub** and authorize Netlify
7. Choose repository: **ward3107/barbershop-website**
8. Branch to deploy: **main**
9. Build command: `npm run build`
10. Publish directory: `dist`
11. Click **Save**

**Result**: Every time you push to GitHub, Netlify will automatically rebuild and deploy!

---

### Option 2: Manual Deployment via Netlify Dashboard

1. Go to https://app.netlify.com/
2. Click on your site "shokhabarber"
3. Go to **Deploys** tab
4. Drag and drop the `dist` folder from your computer
5. Wait for deployment to complete

**To get the dist folder:**
```bash
cd C:\Users\Waseem\Documents\barbershop-website
npm run build
```

Then drag the `dist` folder from your project to Netlify dashboard.

---

## 🔧 Troubleshooting Google Login

If Google login is not working on the live site, here are the steps to fix it:

### Step 1: Check Firebase Environment Variables in Netlify

1. Go to https://app.netlify.com/
2. Click on your site "shokhabarber"
3. Go to **Site configuration** → **Environment variables**
4. **Add these variables** (copy from your local `.env` file):

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

5. Click **Save**
6. **Trigger a new deployment** (Go to Deploys → Trigger deploy → Clear cache and deploy site)

---

### Step 2: Verify Firebase Authorized Domains

1. Go to https://console.firebase.google.com/
2. Select project **shokha-41289**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Make sure these domains are listed:
   - `localhost`
   - `shokhabarber.netlify.app`
   - `shokha-41289.firebaseapp.com`

5. If `shokhabarber.netlify.app` is missing, click **Add domain** and add it

---

### Step 3: Check Browser Console for Errors

1. Open your website: https://shokhabarber.netlify.app/
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Try to log in with Google
5. Look for any red error messages

**Common errors:**

- **"Firebase: Error (auth/unauthorized-domain)"**
  - Solution: Add domain to Firebase authorized domains (Step 2)

- **"Firebase: Error (auth/api-key-not-valid)"**
  - Solution: Check environment variables in Netlify (Step 1)

- **"Cannot read properties of undefined"**
  - Solution: Environment variables not loaded, redeploy after adding them

---

### Step 4: Test Google Login Locally First

Before deploying, test if Google login works locally:

```bash
cd C:\Users\Waseem\Documents\barbershop-website
npm run dev
```

1. Open http://localhost:5173
2. Try to log in with Google
3. If it works locally but not on Netlify → Environment variables issue
4. If it doesn't work locally → Firebase configuration issue

---

## 📝 Next Steps

1. **Set up automatic deployment** (Option 1 above)
2. **Add environment variables to Netlify** (Step 1)
3. **Trigger new deployment**
4. **Test Google login on live site**
5. If still not working, check browser console (Step 3)

---

## 🆘 If You Need Help

Send me:
1. Screenshot of browser console (F12 → Console) when trying to log in
2. Screenshot of Netlify environment variables page
3. Screenshot of Firebase authorized domains page

This will help me diagnose the exact issue!
