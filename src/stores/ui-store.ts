// ═══════════════════════════════════════════════════════════
// ClearPath AI — UI Store (Zustand)
// ═══════════════════════════════════════════════════════════

import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activeTab: string;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,
  activeTab: 'chat',

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
