# Architecture Documentation

## Overview

This video editor application follows a clean architecture pattern with clear separation of concerns, making it maintainable, testable, and scalable.

## Architecture Layers

### 1. **Services Layer** (`src/services/`)
Handles all external API communication:
- `projectsService.js` - REST API for projects (CRUD operations)
- `notesService.js` - GraphQL API for notes (queries and mutations)

**Benefits:**
- Centralized API logic
- Easy to mock for testing
- Consistent error handling
- Uses Ramda for functional data transformations

### 2. **State Management Layer** (`src/stores/`)
Zustand stores for application state:
- `projectsStore.js` - Project list and current project
- `timelineStore.js` - Timeline state (tracks, clips, playhead, zoom)
- `notesStore.js` - Notes for projects
- `historyStore.js` - Undo/redo functionality

**Benefits:**
- Minimal boilerplate (no actions, reducers, or Provider)
- Direct state updates
- Easy to understand and debug
- Fast iteration during development

### 3. **Components Layer** (`src/components/`)
React components organized by feature:

#### Layout Components (`components/layout/`)
- `Header.jsx` - Top navigation with undo/redo, save, settings
- `Sidebar.jsx` - Projects and notes navigation

#### Preview Components (`components/preview/`)
- `PreviewArea.jsx` - Video preview placeholder
- `PlaybackControls.jsx` - Play/pause, time display, scrubber, zoom

#### Timeline Components (`components/timeline/`)
- `Timeline.jsx` - Main timeline editor
- `TimeRuler.jsx` - Time markers
- `Track.jsx` - Individual track with clips
- `Clip.jsx` - Draggable clip component
- `AddClipButton.jsx` - Button to add clips to tracks

### 4. **Utilities Layer** (`src/utils/`)
Pure utility functions:
- `time.js` - Time formatting and parsing (MM:SS, HH:MM:SS)

### 5. **Configuration** (`src/config/`)
- `api.js` - API base URL and endpoint configuration

## Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Zustand Store (State)
    ↓
Service (API)
    ↓
Backend (Mock API)
    ↓
Service (Response)
    ↓
Zustand Store (Update State)
    ↓
Component (Re-render)
```

## State Management Strategy

### Why Zustand?
1. **Simplicity** - No boilerplate, direct state updates
2. **Performance** - Only re-renders components that use changed state
3. **Developer Experience** - Easy to understand and debug
4. **Fast Iteration** - Less code = faster development

### Store Structure
Each store follows a consistent pattern:
- State properties
- Actions (functions that update state)
- Selectors (computed values)
- Async operations (API calls)

## Timeline Data Model

```javascript
{
  tracks: [
    {
      id: "uuid",
      type: "video" | "audio" | "background",
      name: "Track Name",
      clips: [
        {
          id: "uuid",
          startTime: 0,      // seconds
          endTime: 10,       // seconds
          data: {            // flexible data structure
            name: "Clip Name",
            // ... any other properties
          }
        }
      ]
    }
  ],
  duration: 60  // total duration in seconds
}
```

## API Integration

### Projects (REST API)
- Base URL: `http://localhost:3000/api/projects`
- Operations: GET, POST, PUT, DELETE
- Data stored in flexible `data` field

### Notes (GraphQL API)
- Endpoint: `http://localhost:3000/graphql`
- Operations: Query (notes), Mutations (addNote, updateNote, deleteNote)
- Filtered by `projectId` in data field

## Undo/Redo Implementation

Uses a stack-based approach:
- History store maintains array of timeline states
- Each state change saves current state to history
- Undo/redo navigates through history stack
- Limited to 50 states to prevent memory issues

## Key Design Decisions

1. **Flexible Data Model** - No strict schema, frontend decides structure
2. **Component Composition** - Small, focused components
3. **Functional Programming** - Ramda for data transformations
4. **Separation of Concerns** - Clear boundaries between layers
5. **No TypeScript** - ECMAScript only (as per requirements)

## Performance Considerations

1. **Debounced History Saves** - Prevents excessive history entries
2. **Selective Re-renders** - Zustand only updates subscribed components
3. **Efficient Timeline Rendering** - Only visible clips are rendered
4. **Optimized State Updates** - Minimal state updates per action

## Future Improvements

1. **Virtual Scrolling** - For long timelines
2. **Web Workers** - For heavy timeline calculations
3. **Optimistic Updates** - Better UX for API calls
4. **Clip Snapping** - Snap clips to grid or other clips
5. **Multi-select** - Select and manipulate multiple clips
6. **Keyboard Shortcuts** - Faster workflow
7. **Timeline Zoom Presets** - Quick zoom levels
