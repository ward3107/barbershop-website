import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { getDb } from './firebase';

export interface Announcement {
  id?: string;
  textEn: string;
  textAr: string;
  textHe: string;
  type: 'hot' | 'exclusive' | 'limited' | 'vip';
  iconName: string; // Crown, Star, Diamond, Gift, Award
  active: boolean;
  createdAt?: Date | any;
}

/**
 * Get all announcements from Firestore
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const db = getDb();
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(q);

    const announcements: Announcement[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        textEn: data.textEn || '',
        textAr: data.textAr || '',
        textHe: data.textHe || '',
        type: data.type || 'hot',
        iconName: data.iconName || 'Star',
        active: data.active !== false, // default to true
        createdAt: data.createdAt?.toDate() || new Date()
      });
    });

    return announcements;
  } catch (error) {
    console.error('Error getting announcements:', error);
    return [];
  }
}

/**
 * Create a new announcement
 */
export async function createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<string> {
  try {
    const db = getDb();
    const docRef = await addDoc(collection(db, 'announcements'), {
      ...announcement,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
}

/**
 * Update an existing announcement
 */
export async function updateAnnouncement(
  id: string,
  updates: Partial<Omit<Announcement, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const db = getDb();
    const announcementRef = doc(db, 'announcements', id);
    await updateDoc(announcementRef, updates);
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
}

/**
 * Delete an announcement
 */
export async function deleteAnnouncement(id: string): Promise<void> {
  try {
    const db = getDb();
    await deleteDoc(doc(db, 'announcements', id));
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
}

/**
 * Initialize default announcements if none exist
 */
export async function initializeDefaultAnnouncements(): Promise<void> {
  try {
    const existing = await getAnnouncements();
    if (existing.length > 0) return;

    const defaultAnnouncements: Omit<Announcement, 'id' | 'createdAt'>[] = [
      {
        textAr: 'عرض VIP حصري: خصم 40% للعملاء المميزين',
        textEn: 'VIP Exclusive: 40% off for Premium Members',
        textHe: 'VIP בלעדי: 40% הנחה לחברי פרימיום',
        iconName: 'Crown',
        type: 'vip',
        active: true
      },
      {
        textAr: 'تصنيف 5 نجوم ذهبية من 1000+ عميل راضٍ',
        textEn: '5 Golden Stars from 1000+ Satisfied Clients',
        textHe: '5 כוכבי זהב מ-1000+ לקוחות מרוצים',
        iconName: 'Star',
        type: 'hot',
        active: true
      },
      {
        textAr: 'احجز اليوم: تجربة حلاقة احترافية مع خدمات مجانية',
        textEn: 'Book Today: Professional Grooming with Complimentary Services',
        textHe: 'הזמן היום: טיפוח מקצועי עם שירותים חינם',
        iconName: 'Diamond',
        type: 'exclusive',
        active: true
      },
      {
        textAr: 'عرض محدود: باقة العناية الفاخرة بسعر خاص',
        textEn: 'Limited Offer: Luxury Care Package at Special Price',
        textHe: 'הצעה מוגבלת: חבילת טיפוח יוקרתית במחיר מיוחד',
        iconName: 'Gift',
        type: 'limited',
        active: true
      },
      {
        textAr: 'الحائز على جائزة أفضل صالون حلاقة فاخر 2024',
        textEn: 'Award-Winning Luxury Barbershop of 2024',
        textHe: 'זוכה פרס מספרת היוקרה של 2024',
        iconName: 'Award',
        type: 'vip',
        active: true
      }
    ];

    for (const announcement of defaultAnnouncements) {
      await createAnnouncement(announcement);
    }
  } catch (error) {
    console.error('Error initializing default announcements:', error);
  }
}
