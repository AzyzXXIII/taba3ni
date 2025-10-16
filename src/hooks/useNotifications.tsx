import {
  useState,
  useCallback,
  useContext,
  createContext,
  type ReactNode,
} from "react";

// Types
export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  showToast?: boolean; // Whether to show as a toast popup
  persistent?: boolean; // Whether to keep in notification panel
}

interface NotificationsContextType {
  notifications: Notification[];
  toastNotifications: Notification[];
  unreadCount: number;
  addNotification: (
    title: string,
    message: string,
    type: NotificationType,
    options?: {
      duration?: number;
      action?: Notification["action"];
      showToast?: boolean;
      persistent?: boolean;
    }
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastNotifications, setToastNotifications] = useState<Notification[]>(
    []
  );

  const addNotification = useCallback(
    (
      title: string,
      message: string,
      type: NotificationType,
      options: {
        duration?: number;
        action?: Notification["action"];
        showToast?: boolean;
        persistent?: boolean;
      } = {}
    ) => {
      const {
        duration = 5000,
        action,
        showToast = true,
        persistent = true,
      } = options;

      const id = `${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        id,
        title,
        message,
        type,
        timestamp: new Date(),
        read: false,
        action,
        showToast,
        persistent,
      };

      // Add to persistent notifications panel
      if (persistent) {
        setNotifications((prev) => [newNotification, ...prev]);
      }

      // Add to toast notifications (temporary)
      if (showToast) {
        setToastNotifications((prev) => [newNotification, ...prev]);

        if (duration > 0) {
          setTimeout(() => {
            setToastNotifications((prev) => prev.filter((n) => n.id !== id));
          }, duration);
        }
      }
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setToastNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setToastNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: NotificationsContextType = {
    notifications,
    toastNotifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return context;
}
