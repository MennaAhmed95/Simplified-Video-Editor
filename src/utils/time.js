/**
 * Time utility functions
 * Convert between seconds and time display format (MM:SS)
 */
import * as R from 'ramda';

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export const parseTime = (timeString) => {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
};

/**
 * Clamp time value between min and max
 */
export const clampTime = (time, min = 0, max = Infinity) => {
  return Math.max(min, Math.min(time, max));
};
