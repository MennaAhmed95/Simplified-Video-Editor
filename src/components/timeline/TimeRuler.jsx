import React from 'react';
import { formatTime } from '../../utils/time';

/**
 * Time Ruler Component
 * Displays time markers along the timeline
 */
export const TimeRuler = ({ duration, zoom, pixelsPerSecond = 10 }) => {
  const totalWidth = duration * pixelsPerSecond * zoom;
  const interval = zoom < 0.5 ? 10 : zoom < 1 ? 5 : 1; // Show markers every N seconds based on zoom
  
  const markers = [];
  for (let time = 0; time <= duration; time += interval) {
    markers.push(time);
  }

  return (
    <div className="h-8 border-b bg-muted relative" style={{ width: `${totalWidth}px` }}>
      {markers.map((time) => (
        <div
          key={time}
          className="absolute top-0 border-l border-border h-full"
          style={{ left: `${time * pixelsPerSecond * zoom}px` }}
        >
          <span className="absolute top-0 left-1 text-xs text-muted-foreground">
            {formatTime(time)}
          </span>
        </div>
      ))}
    </div>
  );
};
