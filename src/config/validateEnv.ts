// Environment variable validation
// This ensures all required environment variables are set before the app starts

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const optionalEnvVars = [
  'VITE_TWILIO_ACCOUNT_SID',
  'VITE_TWILIO_AUTH_TOKEN',
  'VITE_TWILIO_WHATSAPP_NUMBER',
  'VITE_OWNER_WHATSAPP',
  'VITE_OWNER_PHONE',
  'VITE_MAKE_WEBHOOK_URL',
  'VITE_TELEGRAM_BOT_TOKEN',
  'VITE_TELEGRAM_CHAT_ID',
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_USER_ID',
  'VITE_OWNER_EMAIL',
  'VITE_HCAPTCHA_SITE_KEY'
];

/**
 * Validates that all required environment variables are set
 * Throws an error if any are missing or contain placeholder values
 */
export function validateEnvironment(): void {
  const missing: string[] = [];
  const invalid: string[] = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    const value = import.meta.env[varName];

    if (!value) {
      missing.push(varName);
    } else if (
      value.includes('YOUR_') ||
      value.includes('your_') ||
      value === 'undefined' ||
      value === 'null'
    ) {
      invalid.push(varName);
    }
  });

  if (missing.length > 0 || invalid.length > 0) {
    const errors: string[] = [];

    if (missing.length > 0) {
      errors.push(`❌ Missing required environment variables:\n  - ${missing.join('\n  - ')}`);
    }

    if (invalid.length > 0) {
      errors.push(`❌ Invalid environment variables (contains placeholder values):\n  - ${invalid.join('\n  - ')}`);
    }

    const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 ENVIRONMENT CONFIGURATION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${errors.join('\n\n')}

📝 How to fix:
1. Copy .env.example to .env
2. Fill in all required values from your Firebase console
3. Restart the development server

For more information, see:
- FIREBASE_SETUP.md
- DEPLOYMENT_AND_FIXES.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    console.error(errorMessage);
    throw new Error('Environment configuration error - see console for details');
  }

  // Warn about optional variables
  const missingOptional = optionalEnvVars.filter(
    varName => !import.meta.env[varName] || import.meta.env[varName].includes('YOUR_')
  );

  if (missingOptional.length > 0) {
    console.warn(
      `⚠️ Optional environment variables not configured:\n  - ${missingOptional.join('\n  - ')}\n\n` +
      'Some features may not work. This is OK for development.'
    );
  }

  console.log('✅ Environment variables validated successfully');
}

/**
 * Check if specific feature is configured
 */
export function isFeatureConfigured(feature: 'twilio' | 'make' | 'telegram' | 'emailjs' | 'hcaptcha'): boolean {
  switch (feature) {
    case 'twilio':
      return !!(
        import.meta.env.VITE_TWILIO_ACCOUNT_SID &&
        import.meta.env.VITE_TWILIO_AUTH_TOKEN &&
        !import.meta.env.VITE_TWILIO_ACCOUNT_SID.includes('YOUR_')
      );

    case 'make':
      return !!(
        import.meta.env.VITE_MAKE_WEBHOOK_URL &&
        !import.meta.env.VITE_MAKE_WEBHOOK_URL.includes('YOUR_')
      );

    case 'telegram':
      return !!(
        import.meta.env.VITE_TELEGRAM_BOT_TOKEN &&
        import.meta.env.VITE_TELEGRAM_CHAT_ID &&
        !import.meta.env.VITE_TELEGRAM_BOT_TOKEN.includes('YOUR_')
      );

    case 'emailjs':
      return !!(
        import.meta.env.VITE_EMAILJS_SERVICE_ID &&
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
        import.meta.env.VITE_EMAILJS_USER_ID &&
        !import.meta.env.VITE_EMAILJS_SERVICE_ID.includes('YOUR_')
      );

    case 'hcaptcha':
      return !!(
        import.meta.env.VITE_HCAPTCHA_SITE_KEY &&
        !import.meta.env.VITE_HCAPTCHA_SITE_KEY.includes('YOUR_')
      );

    default:
      return false;
  }
}

/**
 * Get environment info for debugging (safe - no sensitive data)
 */
export function getEnvironmentInfo(): Record<string, boolean> {
  return {
    firebaseConfigured: true, // Always true if validation passed
    twilioConfigured: isFeatureConfigured('twilio'),
    makeConfigured: isFeatureConfigured('make'),
    telegramConfigured: isFeatureConfigured('telegram'),
    emailjsConfigured: isFeatureConfigured('emailjs'),
    hcaptchaConfigured: isFeatureConfigured('hcaptcha'),
    ownerWhatsappConfigured: !!(
      import.meta.env.VITE_OWNER_WHATSAPP &&
      !import.meta.env.VITE_OWNER_WHATSAPP.includes('XXXX')
    )
  };
}
