import React from 'react';
import { formatTime } from '../../utils/time';

/**
 * Time Ruler Component
 * Displays time markers along the timeline with smart spacing
 */
export const TimeRuler = ({ duration, zoom, pixelsPerSecond = 10 }) => {
  const totalWidth = duration * pixelsPerSecond * zoom;
  
  // Dynamic interval based on zoom level
  // Ensure markers don't overlap: need ~60px minimum per marker
  let interval = 10;
  const minPixelsPerMarker = 60;
  
  if (zoom >= 2) interval = 0.5;
  else if (zoom >= 1.2) interval = 1;
  else if (zoom >= 0.8) interval = 2;
  else if (zoom >= 0.5) interval = 5;
  else interval = 10;
  
  // Adjust interval if markers are too close
  while ((interval * pixelsPerSecond * zoom) < minPixelsPerMarker && interval < 60) {
    interval *= 2;
  }
  
  const markers = [];
  for (let time = 0; time <= duration; time += interval) {
    markers.push(Math.round(time * 100) / 100); // Round to avoid floating point issues
  }

  return (
    <div 
      className="h-8 border-b bg-muted relative" 
      style={{ width: `${totalWidth}px`, minWidth: '100%' }}
    >
      {markers.map((time, idx) => {
        const leftPos = time * pixelsPerSecond * zoom;
        return (
          <div
            key={`${time}-${idx}`}
            className="absolute top-0 h-full border-l border-muted-foreground/40 flex items-start pt-1"
            style={{ 
              left: `${leftPos}px`,
            }}
          >
            <span 
              className="text-xs text-muted-foreground font-mono select-none"
              style={{
                transform: 'translateX(2px)',
                whiteSpace: 'nowrap',
              }}
            >
              {formatTime(time)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
