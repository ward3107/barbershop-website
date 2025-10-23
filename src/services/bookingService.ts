import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { getDb } from './firebase';
import type { Booking, BookingStatus } from '@/types';

// Re-export for backward compatibility
export type { Booking, BookingStatus };

/**
 * Create a new booking in Firestore
 */
export async function createBooking(
  customerName: string,
  customerPhone: string,
  service: string,
  date: Date,
  time: string,
  customerEmail?: string,
  userId?: string
): Promise<Booking> {
  const booking: Booking = {
    userId: userId || '',
    customerName,
    customerPhone,
    customerEmail,
    service,
    date,
    time,
    status: 'pending',
    createdAt: serverTimestamp()
  };

  try {
    // Add booking to Firestore
    const docRef = await addDoc(collection(getDb(), 'bookings'), booking);

    return {
      ...booking,
      id: docRef.id,
      createdAt: new Date()
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

/**
 * Get all bookings (admin only)
 */
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const q = query(collection(getDb(), 'bookings'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate()
      } as Booking);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting bookings:', error);
    return [];
  }
}

/**
 * Get bookings for a specific user
 */
export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    const q = query(
      collection(getDb(), 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const bookings: Booking[]= [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookings.push({
        id: doc.id,
        ...data,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate()
      } as Booking);
    });

    return bookings;
  } catch (error) {
    console.error('Error getting user bookings:', error);
    return [];
  }
}

/**
 * Get booked time slots for a specific date
 */
export async function getBookedSlotsForDate(date: Date): Promise<string[]> {
  try {
    // Start and end of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(getDb(), 'bookings'),
      where('date', '>=', startOfDay),
      where('date', '<=', endOfDay),
      where('status', '!=', 'rejected')
    );

    const querySnapshot = await getDocs(q);
    const bookedSlots: string[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      bookedSlots.push(data.time);
    });

    return bookedSlots;
  } catch (error) {
    console.error('Error getting booked slots:', error);
    return [];
  }
}

/**
 * Update booking status (approve/reject/completed)
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'approved' | 'rejected' | 'completed'
): Promise<void> {
  try {
    const bookingRef = doc(getDb(), 'bookings', bookingId);

    // First, get the booking data to check for userId
    const bookingSnapshot = await getDocs(query(collection(getDb(), 'bookings')));
    let bookingData: any = null;

    bookingSnapshot.forEach((docSnap) => {
      if (docSnap.id === bookingId) {
        bookingData = docSnap.data();
      }
    });

    // Update the status
    await updateDoc(bookingRef, { status });

    // If marking as completed, award loyalty points to the user
    if (status === 'completed' && bookingData && bookingData.userId) {
      await awardLoyaltyPoints(bookingData.userId);
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

/**
 * Award loyalty points to a user after completing a booking
 */
export async function awardLoyaltyPoints(userId: string, points: number = 10): Promise<void> {
  try {
    const userRef = doc(getDb(), 'users', userId);
    await updateDoc(userRef, {
      loyaltyPoints: increment(points),
      totalBookings: increment(1)
    });
  } catch (error) {
    console.error('Error awarding loyalty points:', error);
  }
}

/**
 * Cancel a booking (customer-initiated cancellation)
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(getDb(), 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'rejected',
      cancelledAt: serverTimestamp(),
      cancelledBy: 'customer'
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

/**
 * Delete a booking (permanently remove from database - admin only)
 */
export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(getDb(), 'bookings', bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

/**
 * Reschedule a booking to a new date/time
 */
export async function rescheduleBooking(
  bookingId: string,
  newDate: Date,
  newTime: string
): Promise<void> {
  try {
    const bookingRef = doc(getDb(), 'bookings', bookingId);
    await updateDoc(bookingRef, {
      date: newDate,
      time: newTime,
      rescheduledAt: serverTimestamp(),
      status: 'pending' // Reset to pending when rescheduled
    });
  } catch (error) {
    console.error('Error rescheduling booking:', error);
    throw error;
  }
}
