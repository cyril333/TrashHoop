// src/app/components/ui/NotificationBell.tsx
import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Megaphone, AlertTriangle, Calendar, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';  // ✅ FIXED PATH
import { useNavigate } from 'react-router';


const typeIcons: Record<string, React.ReactNode> = {
  announcement: <Megaphone className="w-4 h-4 text-blue-500" />,
  reminder: <Calendar className="w-4 h-4 text-green-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  report_update: <Info className="w-4 h-4 text-purple-500" />,
  violation: <AlertTriangle className="w-4 h-4 text-red-500" />,
  system: <Info className="w-4 h-4 text-gray-500" />,
};

const typeColors: Record<string, string> = {
  announcement: 'border-blue-200 bg-blue-50',
  reminder: 'border-green-200 bg-green-50',
  warning: 'border-orange-200 bg-orange-50',
  report_update: 'border-purple-200 bg-purple-50',
  violation: 'border-red-200 bg-red-50',
  system: 'border-gray-200 bg-gray-50',
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    setIsOpen(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#A5D6A7]/30 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D32F2F] text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl border border-[#E8F5E9] z-50 max-h-[500px] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E8F5E9]">
            <h3 className="font-semibold text-[#1A2E1A]">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#2E7D32] hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[#558B5A]">
                <Bell className="w-10 h-10 mx-auto mb-2 text-[#A5D6A7]" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-[#E8F5E9] cursor-pointer transition hover:bg-gray-50 ${
                    !notification.read ? typeColors[notification.type] || '' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {typeIcons[notification.type] || <Info className="w-4 h-4 text-gray-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium ${!notification.read ? 'text-[#1A2E1A]' : 'text-[#558B5A]'}`}>
                          {notification.title}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id!);
                          }}
                          className="p-1 text-[#A5D6A7] hover:text-red-500 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-[#558B5A] mt-0.5 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-[#A5D6A7] mt-1">{formatTime(notification.createdAt)}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#2E7D32] rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-[#E8F5E9] bg-gray-50">
              <button
                onClick={() => {
                  navigate('/app/dashboard');
                  setIsOpen(false);
                }}
                className="w-full text-xs text-[#2E7D32] hover:underline"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}