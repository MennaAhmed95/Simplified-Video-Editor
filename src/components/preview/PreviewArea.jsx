import React, { useEffect } from 'react';
import { useTimelineStore } from '../../stores/timelineStore';

export const PreviewArea = () => {
  const { playheadPosition, getClipAtPlayhead, activeClipId, setActiveClip } = useTimelineStore();

  useEffect(() => {
    const clipInfo = getClipAtPlayhead();
    if (clipInfo) {
      setActiveClip(clipInfo.clip.id);
    } else {
      setActiveClip(null);
    }
  }, [playheadPosition, getClipAtPlayhead, setActiveClip]);

  const clipInfo = getClipAtPlayhead();
  const activeClip = clipInfo?.clip;

  return (
    <div className="flex-1 flex flex-col bg-muted">
      <div className="flex-1 flex items-center justify-center relative bg-black/50">
        {/* Preview placeholder */}
        <div className="text-center space-y-4">
          <div className="text-6xl">🎬</div>
          <div className="text-muted-foreground">
            PREVIEW AREA
          </div>
          {activeClip && (
            <div className="text-sm text-foreground bg-card px-4 py-2 rounded">
              Active: {activeClip.data?.name || `Clip ${activeClip.id.slice(0, 8)}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
