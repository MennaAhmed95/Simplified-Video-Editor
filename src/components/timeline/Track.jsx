import React from 'react';
import { Clip } from './Clip';

/**
 * Track Component
 * Represents a single track in the timeline
 */
export const Track = ({ track, zoom, pixelsPerSecond, playheadPosition, onClipClick, onClipMove }) => {
  const totalWidth = (track.clips.reduce((max, clip) => Math.max(max, clip.endTime), 0) || 10) * pixelsPerSecond * zoom;

  return (
    <div 
      className="h-16 sm:h-20 border-b bg-card relative" 
      style={{ width: `${totalWidth}px`, minWidth: '100%' }}
    >
      {/* Clips Container */}
      <div className="h-full relative">
        {track.clips.map((clip) => (
          <Clip
            key={clip.id}
            clip={clip}
            zoom={zoom}
            pixelsPerSecond={pixelsPerSecond}
            playheadPosition={playheadPosition}
            onClick={() => onClipClick(clip.id)}
            onMove={(newStartTime) => onClipMove(clip.id, newStartTime)}
          />
        ))}
      </div>
    </div>
  );
};
