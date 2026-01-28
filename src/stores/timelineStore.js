import { create } from 'zustand';
import * as R from 'ramda';
// Use chain for flatMap functionality
const flatMap = R.chain;

/**
 * Timeline Store
 * Manages timeline state: tracks, clips, playhead position, zoom
 * 
 * Data structure:
 * - tracks: Array of track objects
 *   - id: unique track ID
 *   - type: 'video' | 'audio' | 'background'
 *   - name: track name
 *   - clips: Array of clip objects
 *     - id: unique clip ID
 *     - startTime: start time in seconds
 *     - endTime: end time in seconds
 *     - data: clip-specific data
 */
export const useTimelineStore = create((set, get) => ({
  // Timeline state
  tracks: [],
  playheadPosition: 0, // in seconds
  duration: 0, // total duration in seconds
  zoom: 1, // timeline zoom level
  selectedClipId: null,
  activeClipId: null,

  // Initialize timeline from project data
  initializeTimeline: (timelineData) => {
    const tracks = timelineData?.tracks || [];
    const duration = timelineData?.duration || 0;
    set({ tracks, duration, playheadPosition: 0 });
  },

  // Set playhead position
  setPlayheadPosition: (position) => {
    const duration = get().duration;
    const clampedPosition = Math.max(0, Math.min(position, duration));
    set({ playheadPosition: clampedPosition });
  },

  // Set zoom level
  setZoom: (zoom) => {
    const clampedZoom = Math.max(0.1, Math.min(zoom, 10));
    set({ zoom: clampedZoom });
  },

  // Add a new track
  addTrack: (trackData) => {
    const newTrack = {
      id: crypto.randomUUID(),
      type: trackData.type || 'video',
      name: trackData.name || `Track ${get().tracks.length + 1}`,
      clips: [],
      ...trackData,
    };
    
    set((state) => ({
      tracks: [...state.tracks, newTrack],
    }));
    
    return newTrack;
  },

  // Remove a track
  removeTrack: (trackId) => {
    console.log('removeTrack called with:', trackId, 'type:', typeof trackId);
    const currentTracks = get().tracks;
    console.log('Current tracks IDs:', currentTracks.map(t => ({ id: t.id, type: typeof t.id })));
    
    set((state) => {
      console.log('About to filter tracks...');
      const newTracks = state.tracks.filter(track => track.id !== trackId);
      console.log('Before removal - count:', state.tracks.length, 'After removal - count:', newTracks.length);
      return { tracks: newTracks };
    });
    
    console.log('After set - tracks count:', get().tracks.length);
  },

  // Add a clip to a track
  addClip: (trackId, clipData) => {
    const newClip = {
      id: crypto.randomUUID(),
      startTime: clipData.startTime || 0,
      endTime: clipData.endTime || 10,
      data: clipData.data || {},
      ...clipData,
    };

    set((state) => {
      const tracks = state.tracks.map(track => {
        if (track.id === trackId) {
          return {
            ...track,
            clips: [...track.clips, newClip].sort((a, b) => a.startTime - b.startTime),
          };
        }
        return track;
      });

      // Update duration if needed
      const maxEndTime = R.pipe(
        flatMap(R.prop('clips')),
        R.map(R.prop('endTime')),
        R.reduce(R.max, 0)
      )(tracks);

      return {
        tracks,
        duration: Math.max(state.duration, maxEndTime),
      };
    });

    return newClip;
  },

  // Update a clip
  updateClip: (clipId, updates) => {
    set((state) => {
      const tracks = state.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip =>
          clip.id === clipId ? { ...clip, ...updates } : clip
        ),
      }));

      // Update duration if needed
      const maxEndTime = R.pipe(
        flatMap(R.prop('clips')),
        R.map(R.prop('endTime')),
        R.reduce(R.max, 0)
      )(tracks);

      return {
        tracks,
        duration: Math.max(state.duration, maxEndTime),
      };
    });
  },

  // Remove a clip
  removeClip: (clipId) => {
    console.log('removeClip called with:', clipId, 'type:', typeof clipId);
    
    set((state) => {
      const tracks = state.tracks.map(track => {
        const newClips = track.clips.filter(clip => clip.id !== clipId);
        if (track.clips.length !== newClips.length) {
          console.log(`Clip removed from track ${track.id}: ${track.clips.length} -> ${newClips.length}`);
        }
        return {
          ...track,
          clips: newClips,
        };
      });

      // Update duration
      const maxEndTime = R.pipe(
        flatMap(R.prop('clips')),
        R.map(R.prop('endTime')),
        R.reduce(R.max, 0)
      )(tracks);

      return {
        tracks,
        duration: maxEndTime,
      };
    });
  },

  // Split a clip at the current playhead position
  splitClip: (clipId) => {
    const playheadPosition = get().playheadPosition;
    
    set((state) => {
      const tracks = state.tracks.map(track => ({
        ...track,
        clips: track.clips.flatMap(clip => {
          if (clip.id !== clipId) return [clip];
          
          // Check if playhead is within clip bounds
          if (playheadPosition <= clip.startTime || playheadPosition >= clip.endTime) {
            return [clip];
          }

          // Split the clip
          const firstClip = {
            ...clip,
            endTime: playheadPosition,
          };
          
          const secondClip = {
            ...clip,
            id: crypto.randomUUID(),
            startTime: playheadPosition,
          };

          return [firstClip, secondClip];
        }),
      }));

      return { tracks };
    });
  },

  // Select a clip
  selectClip: (clipId) => {
    set({ selectedClipId: clipId });
  },

  // Set active clip (clip at playhead position)
  setActiveClip: (clipId) => {
    set({ activeClipId: clipId });
  },

  // Get clip at playhead position
  getClipAtPlayhead: () => {
    const { tracks, playheadPosition } = get();
    
    for (const track of tracks) {
      const clip = track.clips.find(
        c => playheadPosition >= c.startTime && playheadPosition < c.endTime
      );
      if (clip) {
        return { track, clip };
      }
    }
    
    return null;
  },

  // Move clip
  moveClip: (clipId, newStartTime) => {
    set((state) => {
      const tracks = state.tracks.map(track => ({
        ...track,
        clips: track.clips.map(clip => {
          if (clip.id === clipId) {
            const duration = clip.endTime - clip.startTime;
            return {
              ...clip,
              startTime: Math.max(0, newStartTime),
              endTime: Math.max(0, newStartTime) + duration,
            };
          }
          return clip;
        }),
      }));

      return { tracks };
    });
  },

  // Export timeline data for saving
  exportTimeline: () => {
    const { tracks, duration } = get();
    return { tracks, duration };
  },
}));
