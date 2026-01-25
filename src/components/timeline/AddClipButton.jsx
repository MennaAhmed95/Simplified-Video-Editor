import React from 'react';
import { useTimelineStore } from '../../stores/timelineStore';
import { Button } from '../ui/button';
import { PlusIcon } from '@radix-ui/react-icons';

/**
 * Add Clip Button Component
 * Allows adding clips to tracks
 */
export const AddClipButton = ({ trackId }) => {
  const { playheadPosition, addClip } = useTimelineStore();

  const handleAddClip = () => {
    addClip(trackId, {
      startTime: playheadPosition,
      endTime: playheadPosition + 5, // Default 5 second clip
      data: {
        name: `Clip at ${Math.floor(playheadPosition)}s`,
      },
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleAddClip}
      className="gap-1"
    >
      <PlusIcon className="h-3 w-3" />
      Add Clip
    </Button>
  );
};
