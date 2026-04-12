// src/services/violation.service.ts
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Violation, ViolationHistory } from '../types';

const VIOLATIONS_COLLECTION = 'violations';

/**
 * Create a new violation record
 */
export const createViolation = async (
  violationData: Omit<Violation, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const violationWithTimestamps = {
      ...violationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(
      collection(db, VIOLATIONS_COLLECTION),
      violationWithTimestamps
    );
    return docRef.id;
  } catch (error) {
    console.error('Error creating violation:', error);
    throw error;
  }
};

/**
 * Get violations for a specific user
 */
export const getUserViolations = async (userId: string): Promise<Violation[]> => {
  try {
    const q = query(
      collection(db, VIOLATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Violation));
  } catch (error) {
    console.error('Error fetching user violations:', error);
    throw error;
  }
};

/**
 * Get all violations (admin only)
 */
export const getAllViolations = async (): Promise<Violation[]> => {
  try {
    const q = query(
      collection(db, VIOLATIONS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Violation));
  } catch (error) {
    console.error('Error fetching all violations:', error);
    throw error;
  }
};

/**
 * Get active violations only
 */
export const getActiveViolations = async (): Promise<Violation[]> => {
  try {
    const q = query(
      collection(db, VIOLATIONS_COLLECTION),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Violation));
  } catch (error) {
    console.error('Error fetching active violations:', error);
    throw error;
  }
};

/**
 * Get violations by barangay
 */
export const getViolationsByBarangay = async (barangay: string): Promise<Violation[]> => {
  try {
    const q = query(
      collection(db, VIOLATIONS_COLLECTION),
      where('barangay', '==', barangay),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Violation));
  } catch (error) {
    console.error('Error fetching barangay violations:', error);
    throw error;
  }
};

/**
 * Update violation status
 */
export const updateViolationStatus = async (
  violationId: string,
  status: Violation['status'],
  historyEntry?: ViolationHistory
): Promise<void> => {
  try {
    const violationRef = doc(db, VIOLATIONS_COLLECTION, violationId);
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...(status === 'resolved' && { resolvedAt: new Date() })
    };

    if (historyEntry) {
      updateData.history = arrayUnion(historyEntry);
    }

    await updateDoc(violationRef, updateData);
  } catch (error) {
    console.error('Error updating violation status:', error);
    throw error;
  }
};

/**
 * Add warning to violation
 */
export const addViolationWarning = async (
  violationId: string,
  warningLevel: Violation['warningLevel'],
  remarks: string,
  recordedBy: string,
  recordedByName: string
): Promise<void> => {
  try {
    const violationRef = doc(db, VIOLATIONS_COLLECTION, violationId);
    const historyEntry: ViolationHistory = {
      date: new Date(),
      violation: `Warning issued: ${warningLevel}`,
      action: remarks
    };

    await updateDoc(violationRef, {
      warningLevel,
      remarks,
      recordedBy,
      recordedByName,
      updatedAt: new Date(),
      history: arrayUnion(historyEntry)
    });
  } catch (error) {
    console.error('Error adding violation warning:', error);
    throw error;
  }
};

/**
 * Get violation statistics
 */
export const getViolationStats = async (): Promise<{
  total: number;
  active: number;
  resolved: number;
  byType: Record<string, number>;
}> => {
  try {
    const violations = await getAllViolations();

    const stats = {
      total: violations.length,
      active: violations.filter(v => v.status === 'active').length,
      resolved: violations.filter(v => v.status === 'resolved').length,
      byType: {} as Record<string, number>
    };

    violations.forEach(v => {
      stats.byType[v.violationType] = (stats.byType[v.violationType] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error getting violation stats:', error);
    throw error;
  }
};

/**
 * Delete a violation (admin only)
 */
export const deleteViolation = async (violationId: string): Promise<void> => {
  try {
    const violationRef = doc(db, VIOLATIONS_COLLECTION, violationId);
    await updateDoc(violationRef, {
      status: 'deleted',
      deletedAt: new Date()
    });
  } catch (error) {
    console.error('Error deleting violation:', error);
    throw error;
  }
};

/**
 * Permanently remove a violation from database (use with caution)
 */
export const permanentlyDeleteViolation = async (violationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, VIOLATIONS_COLLECTION, violationId));
  } catch (error) {
    console.error('Error permanently deleting violation:', error);
    throw error;
  }
};

// Need to import deleteDoc at the top
import { deleteDoc } from 'firebase/firestore';