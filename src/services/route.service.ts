// src/services/route.service.ts
import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Route, CollectionSchedule } from '../types';

const ROUTES_COLLECTION = 'routes';
const SCHEDULES_COLLECTION = 'schedules';

// Route Services
export const createRoute = async (routeData: Omit<Route, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ROUTES_COLLECTION), {
      ...routeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const getAllRoutes = async (): Promise<Route[]> => {
  try {
    const q = query(collection(db, ROUTES_COLLECTION), orderBy('priority', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Route));
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export const getCollectorRoutes = async (collectorId: string): Promise<Route[]> => {
  try {
    const q = query(
      collection(db, ROUTES_COLLECTION),
      where('collectorId', '==', collectorId),
      orderBy('priority', 'asc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Route));
  } catch (error) {
    console.error('Error fetching collector routes:', error);
    throw error;
  }
};

export const updateRouteStatus = async (
  routeId: string,
  status: Route['status']
): Promise<void> => {
  try {
    const routeRef = doc(db, ROUTES_COLLECTION, routeId);
    await updateDoc(routeRef, {
      status,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating route:', error);
    throw error;
  }
};

// Schedule Services
export const getCollectionSchedules = async (): Promise<CollectionSchedule[]> => {
  try {
    const q = query(collection(db, SCHEDULES_COLLECTION), orderBy('date', 'asc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CollectionSchedule));
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

export const updateCollectionStatus = async (
  scheduleId: string,
  status: CollectionSchedule['status'],
  collectorId?: string,
  collectorName?: string
): Promise<void> => {
  try {
    const scheduleRef = doc(db, SCHEDULES_COLLECTION, scheduleId);
    await updateDoc(scheduleRef, {
      status,
      ...(collectorId && { collectorId }),
      ...(collectorName && { collectorName }),
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating collection status:', error);
    throw error;
  }
};