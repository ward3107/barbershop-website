# SHOKHA - Barbershop Website

A modern, multilingual barbershop website built with React, TypeScript, and Tailwind CSS. Features appointment booking, gallery showcase, and full accessibility support.

## Features

- **Multi-language Support**: Arabic, English, and Hebrew with RTL/LTR support
- **Appointment Booking**: Interactive modal with calendar and service selection
- **Gallery Showcase**: Display of barbershop work
- **Accessibility Features**: Font size adjustment, high contrast mode, animation controls
- **Responsive Design**: Works seamlessly on all devices
- **Cookie Consent**: GDPR compliant cookie consent banner
- **Announcement Badge**: Rotating announcements for special offers

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Radix UI (components)
- Vite (build tool)

## Installation

1. Navigate to the project directory:
```bash
cd Documents/barbershop-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
barbershop-website/
├── src/
│   ├── components/        # React components
│   │   ├── LandingPage.tsx
│   │   ├── Navigation.tsx
│   │   ├── Logo.tsx
│   │   ├── HomeSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── AppointmentModal.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   ├── AccessibilityMenu.tsx
│   │   ├── AnnouncementBadge.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── CookieConsent.tsx
│   ├── contexts/          # Context providers
│   │   └── LanguageContext.tsx
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Customization

### Updating Announcements
Edit the `announcements` array in `src/components/AnnouncementBadge.tsx`

### Adding Translations
Update the `translations` object in `src/contexts/LanguageContext.tsx`

### Changing Colors
The primary brand color `#C4A572` can be changed throughout the components

## License

This project is proprietary and belongs to SHOKHA barbershop.