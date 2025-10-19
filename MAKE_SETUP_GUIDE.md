# 🚀 Make.com WhatsApp Setup Guide - FREE Automatic WhatsApp

## ✅ What You'll Get:
- ✅ **100% Automatic WhatsApp** notifications
- ✅ **FREE** for up to 500 bookings/month
- ✅ **No coding** required (visual workflow)
- ✅ Customer books → Owner gets WhatsApp automatically
- ✅ Owner approves → Customer gets WhatsApp automatically

---

## 📋 **Requirements:**
1. Make.com account (FREE)
2. Facebook Business account (FREE)
3. WhatsApp Business API access (FREE)
4. Phone number NOT already on WhatsApp

---

## 🔧 **Step-by-Step Setup**

### **Part 1: Create Make.com Account**

1. Go to: https://www.make.com/en/register

2. **Sign up for FREE:**
   - Email: your-email@gmail.com
   - Password: (create strong password)
   - Click "Create a free account"

3. **Verify email:**
   - Check inbox
   - Click verification link

4. **Free tier includes:**
   - ✅ 1,000 operations/month
   - ✅ Good for ~500 bookings
   - ✅ Enough for small barbershop

---

### **Part 2: Set Up WhatsApp Business Cloud API**

#### **Step 2.1: Create Facebook Business Account**

1. Go to: https://business.facebook.com/

2. Click **"Create Account"**

3. Fill in:
   - Business Name: "SHOKHA Barbershop"
   - Your Name
   - Business Email

4. Click "Next" and complete setup

#### **Step 2.2: Set Up WhatsApp Business Platform**

1. Go to Meta Business Suite: https://business.facebook.com/

2. In left menu, click **"WhatsApp Manager"**
   - Or go to: https://business.facebook.com/wa/manage/home/

3. Click **"Get Started"** or **"Add Phone Number"**

4. **Add your phone number:**
   - ⚠️ **IMPORTANT:** Must be a number NOT already registered on WhatsApp
   - Enter phone number (with country code)
   - Click "Next"

5. **Verify phone number:**
   - You'll receive SMS with code
   - Enter the 6-digit code
   - Click "Verify"

6. **Create Business Profile:**
   - Business display name: "SHOKHA Barbershop"
   - Category: "Beauty, Cosmetic & Personal Care"
   - Description: "Professional barbershop in Kfar Yassif"
   - Profile picture: (upload your logo)
   - Click "Save"

#### **Step 2.3: Get Your Credentials**

1. In WhatsApp Manager, click on your phone number

2. Go to **"API Setup"** or **"Configuration"**

3. **Copy these values** (you'll need them later):
   ```
   Phone Number ID: 123456789012345
   WhatsApp Business Account ID: 987654321098765
   Access Token: EAAxxxxxxxxxxxxxxxxxx
   ```

4. Keep these safe and secret!

---

### **Part 3: Create Make.com Scenario (Workflow)**

#### **Scenario 1: New Booking → Owner WhatsApp**

1. **In Make.com dashboard:**
   - Click **"Create a new scenario"**

2. **Add Webhooks Module:**
   - Click the big **"+"** button
   - Search for **"Webhooks"**
   - Select **"Custom webhook"**
   - Click **"Add"**

3. **Create Webhook:**
   - Click **"Create a webhook"**
   - Webhook name: "Barbershop New Booking"
   - Click **"Save"**
   - Copy the webhook URL (looks like: https://hook.integromat.com/xxxxx)

4. **Add WhatsApp Module:**
   - Click the **"+"** after webhook
   - Search for **"WhatsApp"**
   - Select **"WhatsApp Business Cloud"**
   - Choose **"Send a Template Message"** or **"Send a Text Message"**

5. **Connect WhatsApp:**
   - Click **"Add"** next to Connection
   - Paste your:
     - Phone Number ID
     - WhatsApp Business Account ID
     - Access Token
   - Click **"Save"**

6. **Configure Message:**
   - **To:** `{{1.booking.customerPhone}}` (this gets data from webhook)
   - **Message:**
   ```
   🔔 حجز جديد - New Booking

   👤 Customer: {{1.booking.customerName}}
   📱 Phone: {{1.booking.customerPhone}}
   ✂️ Service: {{1.booking.service}}
   📅 Date: {{1.booking.date}}
   ⏰ Time: {{1.booking.time}}

   SHOKHA BARBERSHOP
   ```

7. **For OWNER notification:**
   - Change "To" field to: `972XXXXXXXXX` (your actual number)

8. **Click "OK"**

9. **Turn on scenario:**
   - Toggle switch in bottom-left to **ON**
   - Click **"Save"**

---

#### **Scenario 2: Booking Approved → Customer WhatsApp**

1. **Create new scenario** (repeat steps above)

2. **Webhook name:** "Barbershop Booking Approved"

3. **WhatsApp message to customer:**
   ```
   ✅ موعدك مؤكد - Appointment Confirmed

   مرحباً {{1.booking.customerName}}! 👋

   تم تأكيد موعدك بنجاح:
   📅 التاريخ: {{1.booking.date}}
   ⏰ الوقت: {{1.booking.time}}
   ✂️ الخدمة: {{1.booking.service}}

   📍 SHOKHA BARBERSHOP
   كفر ياسيف

   نراك قريباً! ✨
   See you soon!
   ```

4. **Turn on scenario**

---

#### **Scenario 3: Booking Rejected → Customer WhatsApp**

1. **Create new scenario**

2. **Webhook name:** "Barbershop Booking Rejected"

3. **WhatsApp message:**
   ```
   ❌ عذراً - Appointment Unavailable

   عزيزي {{1.booking.customerName}},

   للأسف الموعد المطلوب غير متاح:
   📅 {{1.booking.date}} - {{1.booking.time}}

   يرجى اختيار موعد آخر من موقعنا

   شكراً لتفهمك 🙏
   SHOKHA BARBERSHOP
   ```

4. **Turn on scenario**

---

### **Part 4: Configure Your Website**

1. **Copy your 3 webhook URLs** from Make.com scenarios

2. **Open your website in browser**

3. **Press F12** (developer console)

4. **Paste this code** (replace with YOUR webhook URLs):

```javascript
// Configure Make.com webhooks
localStorage.setItem('make_webhooks', JSON.stringify({
  newBooking: 'https://hook.integromat.com/xxxxx1',
  approved: 'https://hook.integromat.com/xxxxx2',
  rejected: 'https://hook.integromat.com/xxxxx3'
}));

console.log('✅ Make.com webhooks configured!');
```

5. **Press Enter**

6. **Refresh page** (F5)

---

### **Part 5: Test It!**

1. **Go to your website:** http://localhost:5173

2. **Make a test booking:**
   - Click "Book Appointment"
   - Choose service
   - Choose date/time
   - Enter contact info
   - Click "Send Booking Request"

3. **Check Make.com:**
   - Go to Make.com dashboard
   - Click on "History"
   - You should see the webhook was triggered

4. **Check WhatsApp:**
   - You should receive a WhatsApp message!

---

## 💰 **Costs:**

### **FREE Tier (Good for most barbershops):**
- 1,000 operations/month
- Each booking = 2-3 operations
- Good for ~300-500 bookings/month
- **Cost: $0/month**

### **If You Need More:**
- Core Plan: $9/month (10,000 operations)
- Pro Plan: $16/month (10,000 operations + more features)

---

## 🔧 **Troubleshooting:**

### **"Webhook not receiving data"**
- ✅ Check webhook URL is correct
- ✅ Check scenario is turned ON in Make.com
- ✅ Check browser console for errors

### **"WhatsApp not sending"**
- ✅ Check WhatsApp Business API is approved
- ✅ Check phone number is verified
- ✅ Check Access Token is valid
- ✅ Customer phone number must be in format: +972XXXXXXXXX

### **"Rate limit exceeded"**
- ✅ WhatsApp has sending limits (1,000 messages/day for free tier)
- ✅ If you exceed, you need to get approved for higher tier

---

## 📊 **Message Limits:**

### **WhatsApp Business Cloud API (FREE tier):**
- **1,000 business-initiated conversations/month** (FREE)
- **Unlimited user-initiated conversations** (FREE)
- After 1,000 messages, you pay per conversation

### **Pricing after FREE tier:**
- Business-initiated conversations: $0.005-0.05 per conversation
- Still very cheap!

---

## ✅ **Advantages of Make.com:**

1. ✅ **Visual workflow** - No coding needed
2. ✅ **FREE tier** - Good for most small businesses
3. ✅ **Reliable** - Cloud-based, always running
4. ✅ **Easy to manage** - Your customer can see workflows
5. ✅ **Scalable** - Can add more automations later

---

## 🎯 **Next Steps:**

After setup is complete:
1. ✅ Test thoroughly with real bookings
2. ✅ Show customer how it works
3. ✅ Deploy website to Vercel
4. ✅ Update webhook URLs to production URLs
5. ✅ Customer can monitor Make.com dashboard

---

## 📞 **Need Help?**

If you get stuck:
1. Check Make.com community: https://community.make.com/
2. WhatsApp Business API docs: https://developers.facebook.com/docs/whatsapp
3. Make.com support: support@make.com

---

**🎉 Once set up, everything is automatic and FREE (up to 500 bookings/month)!**
