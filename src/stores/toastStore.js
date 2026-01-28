import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { id, message, type };
    
    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== id),
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },
}));
