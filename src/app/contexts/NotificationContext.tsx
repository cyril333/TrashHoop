// src/app/contexts/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import {
  subscribeToUserNotifications,
  subscribeToUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  subscribeToAnnouncements,
  Notification,
  Announcement,
} from '../../services/notification.service';  // ✅ Fixed path
import toast from 'react-hot-toast';

interface NotificationContextType {
  notifications: Notification[];
  announcements: Announcement[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: string) => Promise<void>;
  isLoading: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastToastId, setLastToastId] = useState<string | null>(null);

  // Subscribe to notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Subscribe to user notifications
    const unsubscribeNotifs = subscribeToUserNotifications(user.uid, (newNotifications) => {
      setNotifications(newNotifications);

      // Show toast for new notifications
      const newNotif = newNotifications.find(n => !n.read && n.createdAt > new Date(Date.now() - 5000));
      if (newNotif && lastToastId !== newNotif.id) {
        setLastToastId(newNotif.id);
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{newNotif.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{newNotif.message}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  markAsRead(newNotif.id!);
                  toast.dismiss(t.id);
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500"
              >
                Mark Read
              </button>
            </div>
          </div>
        ), { duration: 5000 });
      }

      setIsLoading(false);
    });

    // Subscribe to unread count
    const unsubscribeCount = subscribeToUnreadCount(user.uid, (count) => {
      setUnreadCount(count);
    });

    return () => {
      unsubscribeNotifs();
      unsubscribeCount();
    };
  }, [user]);

  // Subscribe to announcements
  useEffect(() => {
    const unsubscribe = subscribeToAnnouncements((newAnnouncements) => {
      setAnnouncements(newAnnouncements);

      // Show toast for urgent announcements
      const urgentAnn = newAnnouncements.find(
        a => a.urgent && a.createdAt > new Date(Date.now() - 10000)
      );
      if (urgentAnn) {
        toast.custom((t) => (
          <div className="max-w-md w-full bg-orange-50 shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-orange-200">
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-orange-800">🚨 {urgentAnn.title}</p>
                  <p className="mt-1 text-sm text-orange-600">{urgentAnn.body}</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-orange-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full p-4 text-sm text-orange-600 hover:text-orange-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        ), { duration: 8000 });
      }
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsAsRead(user.uid);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const removeNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        announcements,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};