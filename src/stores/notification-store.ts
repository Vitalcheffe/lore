// ═══════════════════════════════════════════════════════════
// ClearPath AI — Notification Store (Zustand)
// ═══════════════════════════════════════════════════════════

import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  createdAt: number;
}

interface NotificationState {
  notifications: Notification[];

  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

let notificationCounter = 0;

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notif_${Date.now()}_${++notificationCounter}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: Date.now(),
    };
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration ?? 5000;
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, duration);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}));
