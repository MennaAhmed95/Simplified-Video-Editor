import { create } from 'zustand';
import * as notesService from '../services/notesService.js';
import * as R from 'ramda';

/**
 * Notes Store
 * Manages notes for projects using GraphQL API
 */
export const useNotesStore = create((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,
  currentProjectId: null,

  // Fetch notes for a project
  fetchNotes: async (projectId) => {
    set({ isLoading: true, error: null, currentProjectId: projectId });
    try {
      const notes = await notesService.fetchNotes(projectId);
      set({ notes, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Create a new note
  createNote: async (projectId, noteData) => {
    set({ isLoading: true, error: null });
    try {
      const noteDataWithProject = {
        ...noteData,
        projectId,
      };
      const newNote = await notesService.createNote(noteDataWithProject);
      const notes = R.append(newNote, get().notes);
      set({ notes, isLoading: false });
      return newNote;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update a note
  updateNote: async (id, noteData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedNote = await notesService.updateNote(id, noteData);
      const notes = get().notes;
      const index = notes.findIndex(n => n.id === id);
      const updatedNotes = index >= 0
        ? R.update(index, updatedNote, notes)
        : notes;
      
      set({ notes: updatedNotes, isLoading: false });
      return updatedNote;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete a note
  deleteNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await notesService.deleteNote(id);
      const notes = R.reject(R.propEq('id', id), get().notes);
      set({ notes, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Get notes for current project
  getNotesForProject: (projectId) => {
    const { notes } = get();
    return R.filter(
      R.pipe(
        R.prop('data'),
        R.prop('projectId'),
        R.equals(projectId)
      ),
      notes
    );
  },
}));
