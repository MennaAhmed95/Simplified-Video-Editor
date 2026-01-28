import React, { useRef, useEffect } from 'react';
import { useTimelineStore } from '../../stores/timelineStore';
import { useToastStore } from '../../stores/toastStore';
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
    setZoom,
    selectClip,
    splitClip,
    selectedClipId,
    removeClip,
    removeTrack,
  } = useTimelineStore();

  const { addToast } = useToastStore();

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

  const addTrackToTimeline = (trackId) => {
    const { addClip } = useTimelineStore.getState();
    addClip(trackId, {
      startTime: playheadPosition,
      endTime: playheadPosition + 5, // Default 5 second clip
      data: {
        name: `Clip at ${Math.floor(playheadPosition)}s`,
      },
    });
  };

  const handleZoomOut = () => {
    setZoom(Math.max(0.5, zoom - 0.2));
  };

  const handleZoomIn = () => {
    setZoom(Math.min(3, zoom + 0.2));
  };

  // Calculate the maximum end time of all clips to ensure we show the entire timeline
  const maxClipEndTime = tracks.reduce((max, track) => {
    const trackMaxEndTime = track.clips.reduce((trackMax, clip) => Math.max(trackMax, clip.endTime), 0);
    return Math.max(max, trackMaxEndTime);
  }, duration);

  const totalWidth = maxClipEndTime * PIXELS_PER_SECOND * zoom;

  return (
    <div className="border-t bg-background flex flex-col min-h-0 flex-1">
      {/* Responsive Controls */}
      <div className="px-2 py-1 border-b flex items-center justify-between gap-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSplit}
            disabled={!selectedClipId}
            className="px-3 py-1 text-xs md:text-sm bg-primary text-primary-foreground rounded disabled:opacity-50 whitespace-nowrap hover:bg-primary/90 transition-colors"
          >
            Split Clip
          </button>
          <button
            onClick={() => {
              if (selectedClipId) {
                removeClip(selectedClipId);
                selectClip(null); // Clear selection after delete
                console.log('Clip deleted:', selectedClipId);
                addToast('Clip deleted. Click "Save" to persist changes.', 'success');
              }
            }}
            disabled={!selectedClipId}
            className="px-3 py-1 text-xs md:text-sm bg-red-600 text-white rounded disabled:opacity-50 whitespace-nowrap hover:bg-red-700 transition-colors"
          >
            Delete Clip
          </button>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-xs text-muted-foreground">Zoom:</span>
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 text-xs bg-muted hover:bg-muted-foreground/30 rounded transition-colors"
            title="Zoom Out"
          >
            −
          </button>
          <span className="text-xs text-muted-foreground font-mono min-w-[2.5rem] text-center px-1">
            {(zoom * 100).toFixed(0)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 text-xs bg-muted hover:bg-muted-foreground/30 rounded transition-colors"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>

      {/* Timeline Scroll Area */}
      <div 
        className="relative overflow-x-auto overflow-y-auto flex-1 min-h-0 bg-background"
        ref={timelineRef} 
        onClick={handleTimelineClick}
        style={{
          backgroundImage: `linear-gradient(90deg, transparent ${128}px, #e5e7eb 0) 0 0 / calc(${PIXELS_PER_SECOND * zoom * 5}px) 100% repeat`,
          backgroundPosition: '0 0',
        }}
      >
        {/* Grid Overlay */}
        <div 
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            width: `${maxClipEndTime * PIXELS_PER_SECOND * zoom + 128}px`,
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent ${PIXELS_PER_SECOND * zoom * 2 - 1}px,
              #e5e7eb 0,
              #e5e7eb 1px
            )`,
          }}
        />

        {/* Playhead */}
        <div
          ref={playheadRef}
          className="absolute top-0 bottom-0 z-50 pointer-events-none cursor-col-resize"
          style={{ 
            left: `${playheadPosition * PIXELS_PER_SECOND * zoom + 128}px`,
            width: '2px',
            backgroundColor: '#ef4444',
            boxShadow: '0 0 0 8px rgba(239, 68, 68, 0.1)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-3 border-r-3 border-t-4 border-transparent border-t-red-500" />
        </div>

        {/* Time Ruler */}
        <div className="sticky top-0 z-40 bg-background border-b">
          <TimeRuler duration={maxClipEndTime} zoom={zoom} pixelsPerSecond={PIXELS_PER_SECOND} />
        </div>

        {/* Tracks Container - use flexbox for proper alignment */}
        <div className="flex relative">
          {/* Fixed Track Name Column */}
          <div className="w-24 sm:w-32 bg-muted border-r flex-shrink-0 z-30">
            {tracks.map((track) => (
              <div 
                key={track.id}
                className="h-16 sm:h-20 border-b bg-muted flex items-center justify-between px-1 sm:px-2 gap-1 group hover:bg-muted-foreground/10 transition-colors"
              >
                <span className="text-xs sm:text-sm font-medium truncate flex-1">{track.name}</span>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => addTrackToTimeline(track.id)}
                    className="p-1 hover:bg-background rounded text-xs"
                    title="Add clip"
                  >
                    +
                  </button>
                  <button
                    onClick={() => {
                      removeTrack(track.id);
                      console.log('Track deleted:', track.id);
                      addToast('Track deleted. Click "Save" to persist changes.', 'success');
                    }}
                    className="p-1 hover:bg-red-500/20 rounded text-xs text-red-600 hover:text-red-700"
                    title="Delete track"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Scrollable Tracks Container */}
          <div className="flex-1 relative">
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
      </div>
    </div>
  );
};
