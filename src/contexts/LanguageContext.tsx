import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'ar' | 'en' | 'he';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ar: {
    home: 'الرئيسية',
    gallery: 'معرض الصور',
    videogallery: 'معرض الفيديو',
    reviews: 'اكتب تقييماً',
    location: 'احصل على الاتجاهات',
    callus: 'اتصل بنا',
    makeAppointment: 'احجز موعد',
    vistaBarberShop: 'SHOKHA BARBER SHOP',
    heroTitle1: 'الأفضل',
    heroTitle2: 'من',
    heroTitle3: 'بين',
    heroTitle4: 'الأفضل',
    heroSubtitle: 'لدي خبرة في الحلاقة في قرية كفر ياسيف شمال عكا لمدة 20 عاماً تقريباً',
    recommended: '*** موصى به ***',
    bestProInTown: '• أفضل محترف في المدينة •',
    welcomeTitle: 'مرحباً بكم في',
    kingdomKutz: 'SHOKHA',
    para1: 'في SHOKHA، نؤمن بأن قصة الشعر الرائعة هي أكثر من مجرد خدمة - إنها شكل من أشكال الفن. مع أكثر من 20 عاماً من الخبرة في قرية كفر ياسيف شمال عكا، أتقنا حرفة جعل الرجال يبدون أنيقين وواثقين ومستعدين لغزو العالم. يجمع صالون الحلاقة لدينا بين التقنيات التقليدية والأساليب الحديثة لتقديم نتائج استثنائية في كل مرة.',
    para2: 'ادخل إلى موقعنا في كفر ياسيف واختبر الفرق الذي يصنعه الشغف والخبرة. من القصات الكلاسيكية إلى التدرجات المعاصرة، وتشذيب اللحية إلى الحلاقة بالمنشفة الساخنة، نقدم مجموعة كاملة من خدمات العناية الشخصية المصممة خصيصاً لأسلوبك الفردي. لقد أكسبنا التزامنا بالتميز والاهتمام بالتفاصيل اعترافاً كواحد من أفضل صالونات الحلاقة في القرية.',
    para3: 'أكثر من مجرد صالون حلاقة، SHOKHA هو مكان يمكنك فيه الاسترخاء والراحة والمغادرة وأنت تشعر بالانتعاش. نحن نفخر بخلق جو ترحيبي حيث يتم التعامل مع كل عميل باحترام واهتمام خاص. احجز موعدك اليوم واكتشف لماذا يستمر عملاؤنا في العودة للحصول على تلك القصة المثالية والتجربة التي لا مثيل لها.',
    ourWork: 'أعمالنا',
    checkOutWork: 'تحقق من بعض أفضل قصات الشعر لدينا',
    bookAppointment: 'احجز موعدك',
    chooseDateTime: 'اختر التاريخ والوقت المفضل لديك',
    selectTime: 'اختر الوقت',
    confirmAppointment: 'تأكيد الموعد',
    selectService: 'اختر الخدمة',
    chooseService: 'ما الخدمة التي تحتاجها؟',
    back: 'رجوع',
    cookieMessage: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. هل توافق على استخدام ملفات تعريف الارتباط؟',
    accept: 'قبول',
    decline: 'رفض',
    accessibility: 'إمكانية الوصول',
    textSize: 'حجم النص',
    highContrast: 'تباين عالي',
    resetAccessibility: 'إعادة تعيين',
    largerCursor: 'مؤشر أكبر',
    highlightLinks: 'تسليط الضوء على الروابط',
    pauseAnimations: 'إيقاف الرسوم المتحركة',
  },
  en: {
    home: 'Home',
    gallery: 'Gallery',
    videogallery: 'Video Gallery',
    reviews: 'Write a Review',
    location: 'Get Directions',
    callus: 'Call Us',
    makeAppointment: 'Make An Appointment',
    vistaBarberShop: 'Kfar Yassif Barber Shop',
    heroTitle1: 'The Best',
    heroTitle2: 'of',
    heroTitle3: 'the',
    heroTitle4: 'Best',
    heroSubtitle: 'I have been barbering in Kfar Yassif village northern to Acre for about 20 years',
    recommended: '*** RECOMMENDED ***',
    bestProInTown: '• BestProInTown •',
    welcomeTitle: 'Welcome to',
    kingdomKutz: 'SHOKHA BARBER SHOP',
    para1: 'At SHOKHA BARBER SHOP, we believe that a great haircut is more than just a service—it\'s an art form. With over 20 years of experience in Kfar Yassif village northern to Acre, we\'ve perfected the craft of making men look sharp, confident, and ready to conquer the world. Our barbershop combines traditional techniques with modern styles to deliver exceptional results every time.',
    para2: 'Step into our Kfar Yassif location and experience the difference that passion and expertise make. From classic cuts to contemporary fades, beard trims to hot towel shaves, we offer a full range of grooming services tailored to your individual style. Our commitment to excellence and attention to detail has earned us recognition as one of the best barbershops in the village.',
    para3: 'More than just a barbershop, SHOKHA BARBER SHOP is a place where you can relax, unwind, and leave feeling refreshed. We pride ourselves on creating a welcoming atmosphere where every client is treated with respect and special care. Book your appointment today and discover why our clients keep coming back for that perfect cut and unmatched experience.',
    ourWork: 'Our Work',
    checkOutWork: 'Check out some of our finest haircuts',
    bookAppointment: 'Book Your Appointment',
    chooseDateTime: 'Choose your preferred date and time',
    selectTime: 'Select Time',
    confirmAppointment: 'Confirm Appointment',
    selectService: 'Select Service',
    chooseService: 'What service do you need?',
    back: 'Back',
    cookieMessage: 'We use cookies to improve your experience. Do you agree to the use of cookies?',
    accept: 'Accept',
    decline: 'Decline',
    accessibility: 'Accessibility',
    textSize: 'Text Size',
    highContrast: 'High Contrast',
    resetAccessibility: 'Reset',
    largerCursor: 'Larger Cursor',
    highlightLinks: 'Highlight Links',
    pauseAnimations: 'Pause Animations',
  },
  he: {
    home: 'בית',
    gallery: 'גלריה',
    videogallery: 'גלריית וידאו',
    reviews: 'כתוב ביקורת',
    location: 'קבל הוראות הגעה',
    callus: 'התקשר אלינו',
    makeAppointment: 'קבע תור',
    vistaBarberShop: 'SHOKHA BARBER SHOP',
    heroTitle1: 'הטוב',
    heroTitle2: 'מבין',
    heroTitle3: '',
    heroTitle4: 'הטובים',
    heroSubtitle: 'אני מספר בכפר יאסיף צפונית לעכו במשך כ-20 שנה',
    recommended: '*** מומלץ ***',
    bestProInTown: '• המקצוען הטוב ביותר בעיר •',
    welcomeTitle: 'ברוכים הבאים ל',
    kingdomKutz: 'SHOKHA',
    para1: 'ב-SHOKHA, אנו מאמינים שתספורת מעולה היא יותר מסתם שירות - זו צורת אמנות. עם למעלה מ-20 שנות ניסיון בכפר יאסיף צפונית לעכו, שיכללנו את האומנות של לגרום לגברים להיראות חדים, בטוחים ומוכנים לכבוש את העולם. המספרה שלנו משלבת טכניקות מסורתיות עם סגנונות מודרניים כדי לספק תוצאות יוצאות דופן בכל פעם.',
    para2: 'היכנסו למיקום שלנו בכפר יאסיף וחוו את ההבדל שתשוקה ומומחיות עושים. מתספורות קלאסיות ועד דהייה עכשווית, עיצוב זקן ועד גילוח במגבת חמה, אנו מציעים מגוון מלא של שירותי טיפוח המותאמים לסגנון האישי שלך. המחויבות שלנו למצוינות ותשומת הלב לפרטים הקנתה לנו הכרה כאחת המספרות הטובות ביותר בכפר.',
    para3: 'יותר מסתם מספרה, SHOKHA הוא מקום שבו אתה יכול להירגע, להירגע ולעזוב כשאתה מרגיש רענן. אנו מתגאים ביצירת אווירה מסבירת פנים שבה כל לקוח מטופל בכבוד ובתשומת לב מיוחדת. הזמן את התור שלך היום וגלה למה הלקוחות שלנו ממשיכים לחזור לתספורת המושלמת והחוויה שאין שני לה.',
    ourWork: 'העבודות שלנו',
    checkOutWork: 'בדוק כמה מהתספורות הטובות ביותר שלנו',
    bookAppointment: 'הזמן תור',
    chooseDateTime: 'בחר את התאריך והשעה המועדפים עליך',
    selectTime: 'בחר שעה',
    confirmAppointment: 'אשר תור',
    selectService: 'בחר שירות',
    chooseService: 'איזה שירות אתה צריך?',
    back: 'חזור',
    cookieMessage: 'אנו משתמשים בעוגיות כדי לשפר את החוויה שלך. האם אתה מסכים לשימוש בעוגיות?',
    accept: 'קבל',
    decline: 'דחה',
    accessibility: 'נגישות',
    textSize: 'גודל טקסט',
    highContrast: 'ניגודיות גבוהה',
    resetAccessibility: 'אפס',
    largerCursor: 'סמן גדול יותר',
    highlightLinks: 'הדגש קישורים',
    pauseAnimations: 'השהה אנימציות',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if user has a saved preference
    const savedLang = localStorage.getItem('shokha_language');
    if (savedLang && (savedLang === 'ar' || savedLang === 'en' || savedLang === 'he')) {
      return savedLang as Language;
    }

    // Detect browser language
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const langCode = browserLang.toLowerCase();

    // Map browser language to supported languages
    if (langCode.startsWith('ar')) {
      return 'ar';
    } else if (langCode.startsWith('he') || langCode.startsWith('iw')) {
      return 'he';
    } else {
      return 'en'; // Default to English for all other languages
    }
  });

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ar']] || key;
  };

  useEffect(() => {
    // Update document direction based on language
    document.documentElement.dir = language === 'ar' || language === 'he' ? 'rtl' : 'ltr';
    // Save language preference
    localStorage.setItem('shokha_language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    console.error('useLanguage was called outside of LanguageProvider. Check your component tree.');
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}