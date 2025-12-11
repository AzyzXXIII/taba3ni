import {
  useState,
  useCallback,
  useContext,
  createContext,
  type ReactNode,
} from "react";

// Types
export type NotificationType = "success" | "error" | "warning" | "info";
export type NotificationPriority = "low" | "medium" | "high";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
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
      priority?: NotificationPriority;
      playSound?: boolean;
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

// Notification sound helper
const playNotificationSound = (type: NotificationType) => {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different notification types
    const frequencies = {
      success: 800,
      info: 600,
      warning: 500,
      error: 400,
    };

    oscillator.frequency.value = frequencies[type] || 600;
    oscillator.type = "sine";

    // Quick beep
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.2
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } catch (error) {
    // Fail silently if Web Audio API is not supported
    console.log("Audio notification not supported");
  }
};

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
        priority?: NotificationPriority;
        playSound?: boolean;
      } = {}
    ) => {
      const {
        duration = 5000,
        action,
        showToast = true,
        persistent = true,
        priority = "medium",
        playSound = true,
      } = options;

      const id = `${Date.now()}-${Math.random()}`;
      const newNotification: Notification = {
        id,
        title,
        message,
        type,
        priority,
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

        // Play notification sound
        if (playSound) {
          playNotificationSound(type);
        }

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
