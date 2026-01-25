import React from 'react';
import { Button } from '../ui/button';
import { useHistoryStore } from '../../stores/historyStore';
import { useProjectsStore } from '../../stores/projectsStore';
import { useTimelineStore } from '../../stores/timelineStore';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, PersonIcon } from '@radix-ui/react-icons';

export const Header = () => {
  const { canUndo, canRedo, undo, redo } = useHistoryStore();
  const { getCurrentProject, updateProject } = useProjectsStore();
  const { exportTimeline } = useTimelineStore();

  const handleSave = async () => {
    const project = getCurrentProject();
    if (!project) return;

    const timelineData = exportTimeline();
    await updateProject(project.id, {
      ...project.data,
      timeline: timelineData,
    });
  };

  const handleUndo = () => {
    const state = undo();
    if (state) {
      const { initializeTimeline } = useTimelineStore.getState();
      initializeTimeline(state);
    }
  };

  const handleRedo = () => {
    const state = redo();
    if (state) {
      const { initializeTimeline } = useTimelineStore.getState();
      initializeTimeline(state);
    }
  };

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleUndo}
          disabled={!canUndo()}
          title="Undo"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRedo}
          disabled={!canRedo()}
          title="Redo"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold">Design</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={handleSave}
          className="gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Save
        </Button>
        <Button variant="ghost" size="icon" title="Settings">
          <PersonIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
