import React from 'react';
import { useTimelineStore } from '../../stores/timelineStore';
import { formatTime } from '../../utils/time';
import { Button } from '../ui/button';

// Simple play/pause icons
const PlayIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.75 3a.75.75 0 00-.75.75v12.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
  </svg>
);

export const PlaybackControls = () => {
  const {
    playheadPosition,
    duration,
    setPlayheadPosition,
  } = useTimelineStore();

  const [isPlaying, setIsPlaying] = React.useState(false);
  const playbackIntervalRef = React.useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      playbackIntervalRef.current = setInterval(() => {
        const currentPosition = useTimelineStore.getState().playheadPosition;
        const currentDuration = useTimelineStore.getState().duration;
        if (currentPosition >= currentDuration) {
          setIsPlaying(false);
          clearInterval(playbackIntervalRef.current);
          playbackIntervalRef.current = null;
        } else {
          useTimelineStore.getState().setPlayheadPosition(currentPosition + 0.1);
        }
      }, 100);
    }
  };

  React.useEffect(() => {
    if (playheadPosition >= duration && isPlaying) {
      setIsPlaying(false);
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    }
  }, [playheadPosition, duration, isPlaying]);

  React.useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="h-16 border-t bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <PlayIcon className="h-4 w-4" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-mono">
            {formatTime(playheadPosition)} / {formatTime(duration)}
          </span>
        </div>

        {/* Scrubber */}
        <div className="flex-1 max-w-md">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={playheadPosition}
            onChange={(e) => setPlayheadPosition(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
