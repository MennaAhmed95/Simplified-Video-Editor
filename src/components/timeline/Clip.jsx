import React, { useState } from 'react';

/**
 * Clip Component
 * Represents a single clip on a track
 */
export const Clip = ({ clip, zoom, pixelsPerSecond, playheadPosition, onClick, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const left = clip.startTime * pixelsPerSecond * zoom;
  const width = (clip.endTime - clip.startTime) * pixelsPerSecond * zoom;
  const isActive = playheadPosition >= clip.startTime && playheadPosition < clip.endTime;

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left mouse button
    setIsDragging(true);
    setDragStart({ x: e.clientX, startTime: clip.startTime });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaTime = deltaX / (pixelsPerSecond * zoom);
    const newStartTime = Math.max(0, dragStart.startTime + deltaTime);
    
    onMove(newStartTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      className={`absolute top-1 bottom-1 rounded bg-primary text-primary-foreground cursor-move hover:opacity-90 transition-opacity ${
        isActive ? 'ring-2 ring-ring' : ''
      }`}
      style={{
        left: `${left}px`,
        width: `${Math.max(20, width)}px`,
      }}
      onClick={onClick}
      onMouseDown={handleMouseDown}
    >
      <div className="h-full px-2 flex items-center text-xs truncate">
        {clip.data?.name || `Clip ${clip.id.slice(0, 8)}`}
      </div>
    </div>
  );
};
