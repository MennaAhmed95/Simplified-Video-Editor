import { useEffect } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { PreviewArea } from "./components/preview/PreviewArea";
import { PlaybackControls } from "./components/preview/PlaybackControls";
import { Timeline } from "./components/timeline/Timeline";
import { ToastContainer } from "./components/ui/toast";
import { useProjectsStore } from "./stores/projectsStore";
import { useTimelineStore } from "./stores/timelineStore";
import { useHistoryStore } from "./stores/historyStore";
import { Button } from "./components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

function App() {
  const { getCurrentProject, currentProjectId } = useProjectsStore();
  const { tracks, initializeTimeline, exportTimeline, addTrack } =
    useTimelineStore();
  const { saveState } = useHistoryStore();

  // Load project timeline when project changes
  useEffect(() => {
    const project = getCurrentProject();
    if (project?.data?.timeline) {
      initializeTimeline(project.data.timeline);
    } else {
      initializeTimeline({ tracks: [], duration: 0 });
    }
  }, [currentProjectId, initializeTimeline]);

  // Save state to history when timeline changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const timelineData = exportTimeline();
      saveState(timelineData);
    }, 300); // Debounce to avoid too many history entries

    return () => clearTimeout(timeoutId);
  }, [tracks, exportTimeline, saveState]);

  const handleAddTrack = () => {
    // Determine which type of track to add based on existing tracks
    const backgroundTracks = tracks.filter((t) => t.type === "background").length;
    const videoTracks = tracks.filter((t) => t.type === "video").length;
    const audioTracks = tracks.filter((t) => t.type === "audio").length;

    let trackType, trackName;
    
    // Add in order: background -> video -> audio
    if (backgroundTracks === 0) {
      trackType = "background";
      trackName = `Background ${backgroundTracks + 1}`;
    } else if (videoTracks === 0) {
      trackType = "video";
      trackName = `Video Track ${videoTracks + 1}`;
    } else {
      trackType = "audio";
      trackName = `Audio Track ${audioTracks + 1}`;
    }

    addTrack({
      type: trackType,
      name: trackName,
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header />

      <div className="flex-1 flex overflow-hidden gap-0">
        <Sidebar className="hidden sm:block" />

        <div className="flex-1 flex flex-col min-w-0">
          <PreviewArea />
          <PlaybackControls />

          <div className="flex-1 flex flex-col min-h-0">
            <Timeline />

            {/* Add Track Button */}
            <div className="p-2 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={handleAddTrack}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add Track</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
