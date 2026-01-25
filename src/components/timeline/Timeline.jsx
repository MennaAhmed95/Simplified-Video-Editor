import React, { useRef, useEffect } from 'react';
import { useTimelineStore } from '../../stores/timelineStore';
import { TimeRuler } from './TimeRuler';
import { Track } from './Track';
import { formatTime } from '../../utils/time';

const PIXELS_PER_SECOND = 10;

/**
 * Timeline Component
 * Main timeline editor with tracks and clips
 */
export const Timeline = () => {
  const {
    tracks,
    playheadPosition,
    duration,
    zoom,
    setPlayheadPosition,
    selectClip,
    splitClip,
    selectedClipId,
  } = useTimelineStore();

  const timelineRef = useRef(null);
  const playheadRef = useRef(null);

  // Update playhead position when clicking on timeline
  const handleTimelineClick = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - 128; // Account for track name width
    const time = x / (PIXELS_PER_SECOND * zoom);
    
    if (time >= 0 && time <= duration) {
      setPlayheadPosition(time);
    }
  };

  // Render playhead
  useEffect(() => {
    if (playheadRef.current && timelineRef.current) {
      const playheadX = playheadPosition * PIXELS_PER_SECOND * zoom + 128;
      playheadRef.current.style.left = `${playheadX}px`;
    }
  }, [playheadPosition, zoom]);

  const handleClipClick = (clipId) => {
    selectClip(clipId);
  };

  const handleClipMove = (clipId, newStartTime) => {
    const { moveClip } = useTimelineStore.getState();
    moveClip(clipId, newStartTime);
  };

  const handleSplit = () => {
    if (selectedClipId) {
      splitClip(selectedClipId);
    }
  };

  const totalWidth = duration * PIXELS_PER_SECOND * zoom;

  return (
    <div className="border-t bg-background flex flex-col">
      <div className="relative overflow-x-auto" ref={timelineRef} onClick={handleTimelineClick}>
        {/* Playhead */}
        <div
          ref={playheadRef}
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-50 pointer-events-none"
          style={{ left: `${playheadPosition * PIXELS_PER_SECOND * zoom + 128}px` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500" />
        </div>

        {/* Time Ruler */}
        <TimeRuler duration={duration} zoom={zoom} pixelsPerSecond={PIXELS_PER_SECOND} />

        {/* Tracks */}
        <div>
          {tracks.map((track) => (
            <Track
              key={track.id}
              track={track}
              zoom={zoom}
              pixelsPerSecond={PIXELS_PER_SECOND}
              playheadPosition={playheadPosition}
              onClipClick={handleClipClick}
              onClipMove={handleClipMove}
            />
          ))}
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="p-2 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSplit}
            disabled={!selectedClipId}
            className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded disabled:opacity-50"
          >
            Split Clip
          </button>
        </div>
      </div>
    </div>
  );
};
