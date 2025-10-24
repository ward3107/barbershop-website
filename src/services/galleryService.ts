import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { getStorageInstance } from './firebase';
import { getDb } from './firebase';

export interface GalleryImage {
  id: string;
  url: string;
  storagePath: string;
  uploadedAt: Date;
}

/**
 * Upload an image to Firebase Storage and save metadata to Firestore
 */
export async function uploadGalleryImage(file: File): Promise<GalleryImage> {
  try {
    const storage = getStorageInstance();
    const db = getDb();

    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `gallery/${timestamp}_${file.name}`;
    const storageRef = ref(storage, fileName);

    // Upload the file
    await uploadBytes(storageRef, file);

    // Get the download URL
    const url = await getDownloadURL(storageRef);

    // Save metadata to Firestore
    const imageDoc = await addDoc(collection(db, 'gallery'), {
      url,
      storagePath: fileName,
      uploadedAt: serverTimestamp()
    });

    return {
      id: imageDoc.id,
      url,
      storagePath: fileName,
      uploadedAt: new Date()
    };
  } catch (error) {
    console.error('Error uploading gallery image:', error);
    throw error;
  }
}

/**
 * Get all gallery images from Firestore
 */
export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const db = getDb();
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const images: GalleryImage[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      images.push({
        id: doc.id,
        url: data.url,
        storagePath: data.storagePath,
        uploadedAt: data.uploadedAt?.toDate() || new Date()
      });
    });

    return images;
  } catch (error) {
    console.error('Error getting gallery images:', error);
    return [];
  }
}

/**
 * Delete a gallery image from both Storage and Firestore
 */
export async function deleteGalleryImage(imageId: string, storagePath: string): Promise<void> {
  try {
    const storage = getStorageInstance();
    const db = getDb();

    // Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(db, 'gallery', imageId));
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    throw error;
  }
}
