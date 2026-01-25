import React, { useEffect, useState } from 'react';
import { useProjectsStore } from '../../stores/projectsStore';
import { useNotesStore } from '../../stores/notesStore';
import { Button } from '../ui/button';
import { FileTextIcon, ClipboardIcon, PlusIcon } from '@radix-ui/react-icons';

export const Sidebar = () => {
  const { projects, fetchProjects, createProject, setCurrentProject, currentProjectId } = useProjectsStore();
  const { notes, fetchNotes, createNote, currentProjectId: notesProjectId } = useNotesStore();
  const [showProjects, setShowProjects] = useState(true);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (currentProjectId) {
      fetchNotes(currentProjectId);
    }
  }, [currentProjectId, fetchNotes]);

  const handleCreateProject = async () => {
    const newProject = await createProject({
      name: 'New Project',
      timeline: { tracks: [], duration: 0 },
    });
    setCurrentProject(newProject.id);
  };

  const handleCreateNote = async () => {
    if (!currentProjectId) return;
    await createNote(currentProjectId, {
      content: 'New note',
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <aside className="w-64 border-r bg-background flex flex-col">
      <div className="p-4 space-y-4">
        {/* Projects Section */}
        <div>
          <button
            onClick={() => setShowProjects(!showProjects)}
            className="w-full flex items-center justify-between text-sm font-medium hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <FileTextIcon className="h-4 w-4" />
              <span>Projects</span>
            </div>
          </button>
          
          {showProjects && (
            <div className="mt-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleCreateProject}
              >
                <PlusIcon className="h-4 w-4" />
                New Project
              </Button>
              
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setCurrentProject(project.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent ${
                    currentProjectId === project.id ? 'bg-accent' : ''
                  }`}
                >
                  {project.data?.name || 'Untitled Project'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="w-full flex items-center justify-between text-sm font-medium hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <ClipboardIcon className="h-4 w-4" />
              <span>Notes</span>
            </div>
          </button>
          
          {showNotes && (
            <div className="mt-2 space-y-1">
              {currentProjectId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleCreateNote}
                >
                  <PlusIcon className="h-4 w-4" />
                  New Note
                </Button>
              )}
              
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="px-3 py-2 rounded-md text-sm hover:bg-accent"
                >
                  {note.data?.content || 'Empty note'}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
