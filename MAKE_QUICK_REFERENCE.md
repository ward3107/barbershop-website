# ⚡ Make.com Quick Reference Card

## 🔗 **Important Links:**

| Service | URL |
|---------|-----|
| Make.com Sign Up | https://www.make.com/en/register |
| Facebook Business | https://business.facebook.com/ |
| WhatsApp Manager | https://business.facebook.com/wa/manage/home/ |
| Make.com Dashboard | https://www.make.com/en/scenarios |

---

## 📝 **What You Need:**

### **From Facebook/Meta:**
```
✓ Phone Number ID: _________________
✓ Business Account ID: _________________
✓ Access Token: _________________
```

### **From Make.com:**
```
✓ Webhook URL 1 (New Booking): _________________
✓ Webhook URL 2 (Approved): _________________
✓ Webhook URL 3 (Rejected): _________________
```

---

## 🎯 **Setup Order:**

1. ✅ Create Make.com account
2. ✅ Create Facebook Business account
3. ✅ Set up WhatsApp Business Platform
4. ✅ Get API credentials (Phone ID, Account ID, Token)
5. ✅ Create 3 scenarios in Make.com
6. ✅ Copy 3 webhook URLs
7. ✅ Configure website with webhook URLs
8. ✅ Test!

---

## 💬 **WhatsApp Message Templates:**

### **To Owner (New Booking):**
```
🔔 حجز جديد - New Booking

👤 Customer: {{customerName}}
📱 Phone: {{customerPhone}}
✂️ Service: {{service}}
📅 Date: {{date}}
⏰ Time: {{time}}

SHOKHA BARBERSHOP
```

### **To Customer (Approved):**
```
✅ موعدك مؤكد - Appointment Confirmed

مرحباً {{customerName}}! 👋

تم تأكيد موعدك بنجاح:
📅 {{date}}
⏰ {{time}}
✂️ {{service}}

📍 SHOKHA BARBERSHOP
نراك قريباً! ✨
```

### **To Customer (Rejected):**
```
❌ عذراً - Appointment Unavailable

عزيزي {{customerName}},

للأسف الموعد المطلوب غير متاح:
📅 {{date}} - {{time}}

يرجى اختيار موعد آخر

شكراً لتفهمك 🙏
SHOKHA BARBERSHOP
```

---

## 🔧 **Website Configuration Code:**

Paste in browser console (F12):

```javascript
localStorage.setItem('make_webhooks', JSON.stringify({
  newBooking: 'YOUR_WEBHOOK_URL_1',
  approved: 'YOUR_WEBHOOK_URL_2',
  rejected: 'YOUR_WEBHOOK_URL_3'
}));

console.log('✅ Configured!');
```

---

## ⚠️ **Important Phone Number Rules:**

### **For WhatsApp Business API:**
- ❌ Cannot use number already on regular WhatsApp
- ✅ Need NEW phone number
- ✅ Can be virtual number (Twilio, etc.)
- ✅ Can be cheap SIM card

### **Phone Format:**
```
❌ Wrong: 0534260632
✅ Correct: +972534260632
✅ Correct: 972534260632
```

---

## 📊 **Free Tier Limits:**

| Service | Free Limit | After Limit |
|---------|-----------|-------------|
| Make.com | 1,000 operations/month | $9/month for 10,000 |
| WhatsApp API | 1,000 conversations/month | $0.005-0.05 per conversation |
| Vercel | Unlimited | FREE forever |

**Total FREE: ~500 bookings/month**

---

## 🆘 **Common Errors:**

### **"Webhook not found"**
→ Check webhook URL is correct and scenario is ON

### **"WhatsApp failed to send"**
→ Check Access Token is valid
→ Check phone format is correct (+972...)

### **"Phone number not registered"**
→ Number must be added to WhatsApp Business Platform first

### **"Rate limit exceeded"**
→ Hit 1,000 messages/month limit
→ Upgrade WhatsApp Business tier

---

## ✅ **Testing Checklist:**

- [ ] Make.com scenario is ON (green toggle)
- [ ] Webhook URL is configured in website
- [ ] WhatsApp credentials are correct
- [ ] Phone number is in correct format
- [ ] Test booking goes through
- [ ] WhatsApp received by owner
- [ ] Approval sends WhatsApp to customer

---

## 📞 **Support:**

- Make.com: https://community.make.com/
- WhatsApp API: https://developers.facebook.com/docs/whatsapp
- Your dev: (that's me! 😊)

---

**🎉 Full guide: MAKE_SETUP_GUIDE.md**
