import React from 'react';
import { Clip } from './Clip';
import { AddClipButton } from './AddClipButton';

/**
 * Track Component
 * Represents a single track in the timeline
 */
export const Track = ({ track, zoom, pixelsPerSecond, playheadPosition, onClipClick, onClipMove }) => {
  const totalWidth = (track.clips.reduce((max, clip) => Math.max(max, clip.endTime), 0) || 10) * pixelsPerSecond * zoom;

  return (
    <div className="h-20 border-b bg-card relative" style={{ width: `${totalWidth}px` }}>
      <div className="absolute left-0 top-0 bottom-0 w-32 border-r bg-muted flex items-center justify-between px-2">
        <span className="text-sm font-medium truncate">{track.name}</span>
        <AddClipButton trackId={track.id} />
      </div>
      
      <div className="ml-32 h-full relative">
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
