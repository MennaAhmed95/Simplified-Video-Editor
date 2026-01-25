import { create } from 'zustand';
import * as projectsService from '../services/projectsService.js';
import * as R from 'ramda';

/**
 * Projects Store
 * Manages project list and current project state
 */
export const useProjectsStore = create((set, get) => ({
  projects: [],
  currentProjectId: null,
  isLoading: false,
  error: null,

  // Fetch all projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectsService.fetchProjects();
      set({ projects, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch a single project
  fetchProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectsService.fetchProject(id);
      if (project) {
        // Update or add to projects list
        const projects = get().projects;
        const existingIndex = projects.findIndex(p => p.id === id);
        const updatedProjects = existingIndex >= 0
          ? R.update(existingIndex, project, projects)
          : R.append(project, projects);
        
        set({ 
          projects: updatedProjects,
          currentProjectId: id,
          isLoading: false 
        });
        return project;
      }
      set({ isLoading: false });
      return null;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return null;
    }
  },

  // Create a new project
  createProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectsService.createProject(projectData);
      const projects = R.append(newProject, get().projects);
      set({ 
        projects,
        currentProjectId: newProject.id,
        isLoading: false 
      });
      return newProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update a project
  updateProject: async (id, projectData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedProject = await projectsService.updateProject(id, projectData);
      const projects = get().projects;
      const index = projects.findIndex(p => p.id === id);
      const updatedProjects = index >= 0
        ? R.update(index, updatedProject, projects)
        : projects;
      
      set({ projects: updatedProjects, isLoading: false });
      return updatedProject;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete a project
  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectsService.deleteProject(id);
      const projects = R.reject(R.propEq('id', id), get().projects);
      const currentProjectId = get().currentProjectId === id ? null : get().currentProjectId;
      set({ projects, currentProjectId, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Set current project
  setCurrentProject: (id) => {
    set({ currentProjectId: id });
  },

  // Get current project
  getCurrentProject: () => {
    const { projects, currentProjectId } = get();
    return currentProjectId 
      ? projects.find(p => p.id === currentProjectId) || null
      : null;
  },
}));
