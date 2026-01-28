import React from 'react';
import { Button } from '../ui/button';
import { useHistoryStore } from '../../stores/historyStore';
import { useProjectsStore } from '../../stores/projectsStore';
import { useTimelineStore } from '../../stores/timelineStore';
import { useToastStore } from '../../stores/toastStore';
import { ArrowLeftIcon, ArrowRightIcon, DownloadIcon, PersonIcon } from '@radix-ui/react-icons';

export const Header = () => {
  const { canUndo, canRedo, undo, redo } = useHistoryStore();
  const { getCurrentProject, updateProject } = useProjectsStore();
  const { exportTimeline } = useTimelineStore();
  const { addToast } = useToastStore();
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = async () => {
    const project = getCurrentProject();
    if (!project) {
      console.warn('No project selected');
      return;
    }

    setIsSaving(true);
    try {
      const timelineData = exportTimeline();
      await updateProject(project.id, {
        ...project.data,
        timeline: timelineData,
      });
      setSaveSuccess(true);
      addToast('Project saved successfully!', 'success');
      // Reset success message after 2 seconds
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Error saving project:', error);
      addToast('Error saving project: ' + error.message, 'error');
    } finally {
      setIsSaving(false);
    }
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
          disabled={isSaving}
          className={`gap-2 ${saveSuccess ? 'bg-green-500/10 text-green-600' : ''}`}
        >
          <DownloadIcon className="h-4 w-4" />
          {saveSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="ghost" size="icon" title="Settings">
          <PersonIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
