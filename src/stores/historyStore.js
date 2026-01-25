import { create } from 'zustand';
import * as R from 'ramda';

/**
 * History Store (Undo/Redo)
 * Manages undo/redo functionality for timeline operations
 * 
 * Uses a simple stack-based approach for efficient undo/redo
 */
export const useHistoryStore = create((set, get) => ({
  history: [], // Array of timeline states
  currentIndex: -1, // Current position in history
  maxHistorySize: 50, // Maximum number of history entries

  // Save current state to history
  saveState: (timelineState) => {
    const { history, currentIndex, maxHistorySize } = get();
    
    // Remove any states after current index (when undoing and then making a new change)
    const newHistory = history.slice(0, currentIndex + 1);
    
    // Add new state
    const updatedHistory = [...newHistory, R.clone(timelineState)];
    
    // Limit history size
    const limitedHistory = updatedHistory.length > maxHistorySize
      ? updatedHistory.slice(-maxHistorySize)
      : updatedHistory;
    
    set({
      history: limitedHistory,
      currentIndex: limitedHistory.length - 1,
    });
  },

  // Undo: go back one step
  undo: () => {
    const { history, currentIndex } = get();
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      set({ currentIndex: newIndex });
      return R.clone(history[newIndex]);
    }
    return null;
  },

  // Redo: go forward one step
  redo: () => {
    const { history, currentIndex } = get();
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      set({ currentIndex: newIndex });
      return R.clone(history[newIndex]);
    }
    return null;
  },

  // Check if undo is available
  canUndo: () => {
    const { currentIndex } = get();
    return currentIndex > 0;
  },

  // Check if redo is available
  canRedo: () => {
    const { history, currentIndex } = get();
    return currentIndex < history.length - 1;
  },

  // Clear history
  clearHistory: () => {
    set({ history: [], currentIndex: -1 });
  },

  // Get current state from history
  getCurrentState: () => {
    const { history, currentIndex } = get();
    if (currentIndex >= 0 && currentIndex < history.length) {
      return R.clone(history[currentIndex]);
    }
    return null;
  },
}));
