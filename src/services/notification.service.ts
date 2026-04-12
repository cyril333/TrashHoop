// src/services/notification.service.ts
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';
const ANNOUNCEMENTS_COLLECTION = 'announcements';

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'warning' | 'report_update' | 'violation' | 'system';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  senderId?: string;
  senderName?: string;
}

export interface Announcement {
  id?: string;
  title: string;
  body: string;
  type: 'event' | 'schedule' | 'info' | 'reminder' | 'urgent';
  urgent: boolean;
  targetRoles?: string[];
  targetBarangay?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByName: string;
}

// ============== NOTIFICATIONS ==============

export const sendNotification = async (
  userId: string,
  title: string,
  message: string,
  type: Notification['type'],
  actionUrl?: string
): Promise<string> => {
  try {
    const notification: Omit<Notification, 'id'> = {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
      actionUrl,
    };

    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), notification);
    return docRef.id;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

export const sendBulkNotifications = async (
  userIds: string[],
  title: string,
  message: string,
  type: Notification['type'],
  actionUrl?: string
): Promise<void> => {
  try {
    // Firestore batch limit is 500, so process in chunks if needed
    const chunkSize = 400;
    for (let i = 0; i < userIds.length; i += chunkSize) {
      const batch = writeBatch(db);
      const notificationsRef = collection(db, NOTIFICATIONS_COLLECTION);
      const chunk = userIds.slice(i, i + chunkSize);

      chunk.forEach((userId) => {
        const newNotifRef = doc(notificationsRef);
        batch.set(newNotifRef, {
          userId,
          title,
          message,
          type,
          read: false,
          createdAt: serverTimestamp(),
          actionUrl: actionUrl || null,
        });
      });

      await batch.commit();
    }
    console.log(`Sent ${userIds.length} notifications`);
  } catch (error) {
    console.error('Error sending bulk notifications:', error);
    throw error;
  }
};

export const subscribeToUserNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void,
  limitCount: number = 50
): (() => void) => {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications: Notification[] = [];
    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Notification);
    });
    callback(notifications);
  }, (error) => {
    console.error('Error subscribing to notifications:', error);
  });
};

export const getUserNotifications = async (
  userId: string,
  limitCount: number = 50
): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const notifications: Notification[] = [];
    snapshot.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      } as Notification);
    });
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(notifRef, { read: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const subscribeToUnreadCount = (
  userId: string,
  callback: (count: number) => void
): (() => void) => {
  const q = query(
    collection(db, NOTIFICATIONS_COLLECTION),
    where('userId', '==', userId),
    where('read', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size);
  }, (error) => {
    console.error('Error subscribing to unread count:', error);
  });
};

export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), { deleted: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// ============== ANNOUNCEMENTS ==============

export const createAnnouncement = async (
  announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    console.log('📢 Creating announcement:', announcement);

    // Create announcement document
    const annData = {
      ...announcement,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, ANNOUNCEMENTS_COLLECTION), annData);
    console.log('✅ Announcement created with ID:', docRef.id);

    // Get all users
    const usersRef = collection(db, 'users');
    const allUsersSnapshot = await getDocs(query(usersRef));
    console.log('👥 Total users in database:', allUsersSnapshot.size);

    // Filter users based on criteria
    const userIds: string[] = [];
    allUsersSnapshot.forEach((doc) => {
      const data = doc.data();

      // Check role filter (if specified)
      const roleMatch = !announcement.targetRoles ||
                        announcement.targetRoles.length === 0 ||
                        announcement.targetRoles.includes(data.role);

      // Check barangay filter (if specified and not empty)
      const barangayMatch = !announcement.targetBarangay ||
                            announcement.targetBarangay.trim() === '' ||
                            data.barangay === announcement.targetBarangay;

      if (roleMatch && barangayMatch) {
        userIds.push(doc.id);
      }
    });

    console.log(`📨 Sending announcement to ${userIds.length} users`);

    // Send notifications
    if (userIds.length > 0) {
      await sendBulkNotifications(
        userIds,
        announcement.title,
        announcement.body,
        'announcement',
        '/app/dashboard'
      );
      console.log('✅ Notifications sent successfully!');
    } else {
      console.log('⚠️ No users matched the criteria');
    }

    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating announcement:', error);
    throw error;
  }
};

export const subscribeToAnnouncements = (
  callback: (announcements: Announcement[]) => void,
  limitCount: number = 20
): (() => void) => {
  const q = query(
    collection(db, ANNOUNCEMENTS_COLLECTION),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const announcements: Announcement[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Announcement);
    });
    callback(announcements);
  }, (error) => {
    console.error('Error subscribing to announcements:', error);
  });
};

export const getAnnouncements = async (limitCount: number = 20): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, ANNOUNCEMENTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Announcement);
    });
    return announcements;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
};

export const updateAnnouncement = async (
  announcementId: string,
  data: Partial<Announcement>
): Promise<void> => {
  try {
    const annRef = doc(db, ANNOUNCEMENTS_COLLECTION, announcementId);
    await updateDoc(annRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, ANNOUNCEMENTS_COLLECTION, announcementId), {
      deleted: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};

// ============== AUTOMATIC NOTIFICATIONS ==============

export const notifyReportStatusChange = async (
  userId: string,
  reportId: string,
  newStatus: string,
  adminName: string
): Promise<void> => {
  const statusMessages: Record<string, string> = {
    under_review: 'Your report is now under review',
    resolved: 'Your report has been resolved',
    rejected: 'Your report was rejected',
  };

  await sendNotification(
    userId,
    'Report Status Update',
    `${statusMessages[newStatus] || 'Your report status has been updated'} by ${adminName}.`,
    'report_update',
    `/app/report?id=${reportId}`
  );
};

export const notifyViolationRecorded = async (
  userId: string,
  violationType: string,
  warningLevel: string
): Promise<void> => {
  await sendNotification(
    userId,
    'Violation Recorded',
    `A new violation (${violationType}) has been recorded. Warning Level: ${warningLevel}.`,
    'violation',
    '/app/violations'
  );
};

export const sendCollectionReminder = async (
  userId: string,
  collectionType: string,
  collectionDate: string
): Promise<void> => {
  await sendNotification(
    userId,
    'Collection Reminder',
    `${collectionType} waste collection is scheduled for ${collectionDate}. Please prepare your bins.`,
    'reminder',
    '/app/schedule'
  );
};