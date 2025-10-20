# WhatsApp Confirmation Messages Setup

## Overview
When you approve or reject a booking in the admin dashboard, the system automatically sends a WhatsApp message to the customer using Make.com (formerly Integromat) webhooks.

## How It Works

```
Customer Books → Admin Approves → Make.com Webhook → WhatsApp Message to Customer
```

## Setup Instructions

### Step 1: Create Make.com Account
1. Go to https://www.make.com/
2. Sign up for a free account
3. Verify your email

### Step 2: Get WhatsApp Business API Access

**Option A: Use Make.com's WhatsApp Module (Recommended - Easier)**
1. You need a WhatsApp Business account
2. Make.com connects directly to WhatsApp Business API
3. Follow Make.com's WhatsApp setup wizard

**Option B: Use Twilio (Alternative)**
1. Go to https://www.twilio.com/
2. Sign up and get WhatsApp sandbox number
3. Use Make.com's Twilio module

### Step 3: Create Make.com Scenario

1. **Create New Scenario**
   - Click "Create a new scenario"
   - Name it "SHOKHA Booking Confirmations"

2. **Add Webhook Module**
   - Search for "Webhooks"
   - Add "Custom webhook" as first module
   - Click "Create a webhook"
   - Name it "shokha-bookings"
   - **COPY THE WEBHOOK URL** - you'll need this!

3. **Add Router**
   - Add a "Router" after the webhook
   - This will handle different event types

4. **Add Routes:**

   **Route 1: Booking Approved**
   - Set filter: `event` equals `booking_approved`
   - Add WhatsApp/Twilio module
   - Configure message:
     ```
     مرحباً {{booking.customerName}} 👋

     ✅ تم تأكيد موعدك في SHOKHA Barber Shop

     📅 التاريخ: {{booking.date}}
     ⏰ الوقت: {{booking.time}}
     💈 الخدمة: {{booking.service}}

     نحن في انتظارك!
     📞 للاستفسار: 0527412003
     ```

   **Route 2: Booking Rejected**
   - Set filter: `event` equals `booking_rejected`
   - Add WhatsApp/Twilio module
   - Configure message:
     ```
     مرحباً {{booking.customerName}} 👋

     ❌ نأسف، لا يمكننا تأكيد موعدك المطلوب

     📅 التاريخ: {{booking.date}}
     ⏰ الوقت: {{booking.time}}

     الرجاء اختيار وقت آخر أو الاتصال بنا
     📞 للاستفسار: 0527412003
     ```

5. **Test the Scenario**
   - Click "Run once"
   - The scenario is now waiting for webhook data

### Step 4: Add Webhook URL to Your Website

1. Open `src/services/makeWebhook.ts`
2. Replace `YOUR_MAKE_WEBHOOK_URL_HERE` with your actual webhook URL from Make.com
3. Example:
   ```typescript
   const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/abcd1234xyz5678...';
   ```

4. Rebuild and redeploy:
   ```bash
   npm run build
   git add .
   git commit -m "Add Make.com webhook URL"
   git push
   ```

### Step 5: Test the Integration

1. **Create Test Booking**
   - Go to your website
   - Book an appointment (use your phone number for testing)

2. **Approve in Admin Dashboard**
   - Login to admin (#admin)
   - Click "Approve" on the test booking
   - Check your WhatsApp - you should receive confirmation!

3. **Test Rejection**
   - Create another test booking
   - Click "Reject"
   - Check WhatsApp for rejection notification

## Troubleshooting

### Messages Not Sending?

1. **Check Make.com Execution History**
   - Go to Make.com dashboard
   - Click on your scenario
   - View "History" tab
   - Check if webhook was received

2. **Check Browser Console**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for errors like:
     - `❌ Make.com webhook failed`
     - `❌ Error sending to Make.com`

3. **Verify Webhook URL**
   - Make sure `MAKE_WEBHOOK_URL` in `makeWebhook.ts` is correct
   - Should start with `https://hook`
   - Should not have `YOUR_MAKE_WEBHOOK_URL_HERE`

4. **Check WhatsApp Number Format**
   - Customer phone should include country code
   - Example: +972527412003 (Israel)
   - Make.com needs proper format

### Alternative: Test Without Make.com

For testing purposes, you can send messages directly via WhatsApp Web:
1. When you approve a booking, copy the customer's phone number
2. Open WhatsApp Web
3. Start a chat and send the confirmation manually

## Message Templates

### Arabic (Primary)
```
✅ موعدك مؤكد
📅 {{date}} في {{time}}
💈 {{service}}
📍 SHOKHA Barber Shop
```

### English
```
✅ Your appointment is confirmed
📅 {{date}} at {{time}}
💈 {{service}}
📍 SHOKHA Barber Shop
```

### Hebrew
```
✅ התור שלך מאושר
📅 {{date}} בשעה {{time}}
💈 {{service}}
📍 SHOKHA Barber Shop
```

## Cost Estimation

- **Make.com Free Tier**: 1,000 operations/month (enough for small shop)
- **WhatsApp Business API**: Usually free for small volume
- **Twilio (if used)**: ~$0.005 per message

For a barbershop with 100-200 bookings/month, this should be FREE!

## Support

If you need help setting this up:
1. Check Make.com documentation: https://www.make.com/en/help
2. Watch Make.com tutorials on YouTube
3. Contact Make.com support (very responsive!)

---

**Status**: Webhook integration code is complete ✅
**Next**: Get Make.com webhook URL and configure it
