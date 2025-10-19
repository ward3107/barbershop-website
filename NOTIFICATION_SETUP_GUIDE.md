# SHOKHA Barbershop - Notification Setup Guide

## Quick Start

The notification system is already integrated into your app. Here's how to configure it:

## 1. WhatsApp Notifications (Recommended - Free & Easy)

### Owner WhatsApp Setup:
1. Open `src/services/notificationService.ts`
2. Find this line:
   ```typescript
   ownerWhatsapp: '972501234567', // Replace with your number
   ```
3. Replace with your actual WhatsApp number (include country code)
   - Israel: 972 + your number (without the 0)
   - Example: If your number is 050-123-4567, use: 972501234567

### How It Works:
- When a customer books, a WhatsApp Web link opens
- The message is pre-filled with all booking details
- Just click "Send" to receive it on your phone
- No API key needed - uses WhatsApp Web

## 2. Email Notifications (Optional)

If you want email notifications too:

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your credentials

### Step 2: Update Configuration
1. Open `src/services/notificationService.ts`
2. Update these values:
   ```typescript
   email: {
     serviceId: 'YOUR_SERVICE_ID',
     templateId: 'YOUR_TEMPLATE_ID',
     publicKey: 'YOUR_PUBLIC_KEY'
   }
   ```

## 3. Owner Dashboard Access

### Login URL:
- Local: http://localhost:5173/admin
- Production: https://your-domain.com/admin

### Default Password:
- Password: `shokha2024`
- **IMPORTANT**: Change this in `src/components/OwnerDashboard.tsx` line 7

### To Change Password:
1. Open `src/components/OwnerDashboard.tsx`
2. Find line 7:
   ```typescript
   const OWNER_PASSWORD = 'shokha2024'; // Change this!
   ```
3. Replace with your secure password

## 4. Testing the System

### Test Booking Flow:
1. Open your website
2. Click "Book Appointment" button
3. Fill in test details:
   - Name: Test Customer
   - Phone: Your phone number
   - Select a service
   - Choose date and time
4. Submit the booking
5. You should receive a WhatsApp notification immediately

### Test Owner Dashboard:
1. Go to /admin
2. Login with your password
3. You'll see the test booking as "Pending"
4. Click "Approve" or "Reject"
5. Customer gets confirmation

## 5. Managing Bookings

### In the Owner Dashboard:
- **Yellow Badge** = Pending (needs your action)
- **Green Badge** = Approved
- **Red Badge** = Rejected

### Actions:
- ✅ **Approve**: Confirms the appointment
- ❌ **Reject**: Cancels the appointment
- 📱 **WhatsApp**: Opens chat with customer
- 📅 **Calendar**: Customer can add to their calendar

## 6. Customer Features

### Rating System:
- After service, customers can rate their experience
- Ratings appear on the main page
- Helps build trust with new customers

### Booking Confirmation:
- Customers get instant confirmation
- Can add appointment to Google/Apple calendar
- Receive reminder notifications

## Troubleshooting

### WhatsApp Not Opening?
- Make sure WhatsApp Web is logged in
- Check the phone number format (include country code)
- Try on desktop browser (not mobile)

### Not Receiving Notifications?
- Check your WhatsApp number in config
- Make sure you're logged into owner dashboard
- Check browser popup settings

### Dashboard Not Loading?
- Clear browser cache
- Check you're using /admin URL
- Verify password is correct

## Security Notes

1. **Change the default password immediately**
2. **Don't share the admin URL publicly**
3. **Keep your WhatsApp number private in production**
4. **Consider adding HTTPS for production**

## Need Help?

If you need assistance setting up:
1. WhatsApp notifications work immediately (no setup needed)
2. For email setup, EmailJS has great documentation
3. The system works offline with localStorage

## Production Deployment

When ready to go live:
1. Change the owner password
2. Update WhatsApp number
3. Set up a domain name
4. Enable HTTPS
5. Consider a backend for better security

---

Your barbershop booking system is ready to use!
Start by updating your WhatsApp number and testing a booking.