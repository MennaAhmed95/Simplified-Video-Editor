import React, { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PreviewArea } from './components/preview/PreviewArea';
import { PlaybackControls } from './components/preview/PlaybackControls';
import { Timeline } from './components/timeline/Timeline';
import { useProjectsStore } from './stores/projectsStore';
import { useTimelineStore } from './stores/timelineStore';
import { useHistoryStore } from './stores/historyStore';
import { Button } from './components/ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

function App() {
  const { getCurrentProject } = useProjectsStore();
  const { tracks, initializeTimeline, exportTimeline, addTrack } = useTimelineStore();
  const { saveState } = useHistoryStore();

  // Load project timeline when project changes
  useEffect(() => {
    const project = getCurrentProject();
    if (project?.data?.timeline) {
      initializeTimeline(project.data.timeline);
    } else {
      initializeTimeline({ tracks: [], duration: 0 });
    }
  }, [getCurrentProject, initializeTimeline]);

  // Save state to history when timeline changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const timelineData = exportTimeline();
      saveState(timelineData);
    }, 300); // Debounce to avoid too many history entries

    return () => clearTimeout(timeoutId);
  }, [tracks, exportTimeline, saveState]);

  const handleAddTrack = () => {
    const trackTypes = ['background', 'video', 'audio'];
    const trackNames = ['Background', 'Video Track', 'Audio Track'];
    const trackIndex = tracks.filter(t => t.type === 'video').length;
    
    addTrack({
      type: trackTypes[Math.min(trackIndex, trackTypes.length - 1)],
      name: `${trackNames[Math.min(trackIndex, trackNames.length - 1)]} ${trackIndex + 1}`,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <PreviewArea />
          <PlaybackControls />
          
          <div className="flex-1 flex flex-col min-h-0">
            <Timeline />
            
            {/* Add Track Button */}
            <div className="p-2 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={handleAddTrack}
                className="gap-2"
              >
                <PlusIcon className="h-4 w-4" />
                Add Track
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
