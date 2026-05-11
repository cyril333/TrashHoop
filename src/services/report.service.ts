// src/services/report.service.ts
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';

const REPORTS_COLLECTION = 'reports';

export interface Report {
  id?: string;
  userId: string;
  reporterName: string;
  address: string;
  type: string;
  description: string;
  photoURL?: string;
  status: 'pending' | 'under_review' | 'resolved';
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// Upload photo
export const uploadReportPhoto = async (file: File, userId: string): Promise<string> => {
  const timestamp = Date.now();
  const filename = `reports/${userId}/${timestamp}_${file.name}`;
  const storageRef = ref(storage, filename);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Create report
export const createReport = async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log("Creating report in Firestore:", reportData);

    // Create base object with timestamps
    const reportWithTimestamps: any = {
      ...reportData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // ✅ FIX: Remove undefined fields before sending to Firestore
    Object.keys(reportWithTimestamps).forEach(key => {
      if (reportWithTimestamps[key] === undefined) {
        delete reportWithTimestamps[key];
      }
    });

    console.log("Cleaned report data:", reportWithTimestamps);

    const docRef = await addDoc(collection(db, REPORTS_COLLECTION), reportWithTimestamps);
    console.log("Report created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

// Get all reports
export const getAllReports = async (): Promise<Report[]> => {
  try {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

// Get user reports
export const getUserReports = async (userId: string): Promise<Report[]> => {
  try {
    const q = query(collection(db, REPORTS_COLLECTION), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Report));
  } catch (error) {
    console.error('Error fetching user reports:', error);
    return [];
  }
};

// Update report status
export const updateReportStatus = async (reportId: string, status: Report['status'], verifiedBy?: string): Promise<void> => {
  try {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (verifiedBy) {
      updateData.verifiedBy = verifiedBy;
      updateData.verifiedAt = new Date();
    }

    const reportRef = doc(db, REPORTS_COLLECTION, reportId);
    await updateDoc(reportRef, updateData);
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};