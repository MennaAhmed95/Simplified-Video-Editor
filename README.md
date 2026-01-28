# Video Editor - Frontend Application

A simplified video editor application built with React, featuring a multi-track timeline, clip management, project persistence, and notes integration.

## Stack

- **React 18+** (v19.2.3)
- **TailwindCSS v3+** (v3.4.19)
- **shadcn/ui** - Component library
- **Zustand** - State management (simpler, less boilerplate)
- **Ramda** - Functional programming utilities (with custom flatMap implementation)
- **Vite** - Build tool
- **Radix UI Icons** - Icon library

## Getting Started

### Prerequisites

**Important:** The frontend requires a running backend API server.

#### 1. Start the Mock API Server

The mock API server provides:
- REST endpoints for project management (`/api/projects`)
- GraphQL endpoint for notes (`/graphql`)

```bash
cd ../mock-api
npm install
npm start
```

The API server will run on `http://localhost:3000`

If you need to change the API URL, set the environment variable:
```bash
VITE_API_URL=http://localhost:3000 yarn dev
```

### Install Dependencies

```bash
yarn install
```

### Development

```bash
yarn dev
```

The application will be available at `http://localhost:5173` (or the next available port)

### Build

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## Features

### ✅ Fully Implemented

- **Multi-track Timeline** - Add video, audio, and background tracks with proper naming
- **Clip Management** - Add, move, split, and delete clips on timeline
- **Clip Deletion** - Delete Clip button in toolbar (with toast notification)
- **Track Deletion** - Delete Track button (✕) on track hover
- **Playhead Control** - Play/pause with scrubbing, playhead visual indicator
- **Project Management** - Create, load, and manage projects
- **Notes System** - Add and view notes per project (GraphQL integration)
- **Undo/Redo** - Full history support for timeline changes
- **Timeline Zoom** - Zoom in/out (0.5x - 3x) for precise editing
- **Timeline Grid** - Visual grid overlay with time markers
- **Responsive Design** - Mobile and desktop optimized UI
- **Track Management** - Add different track types with proper naming
- **Toast Notifications** - Non-blocking user feedback for actions

### ⚠️ Known Limitations

- **Multiple clip selection** - Currently only single selection
- **Drag-to-extend clip duration** - Not implemented
- **Keyboard shortcuts** - Not implemented
- **Confirmation dialogs** - Deletions happen immediately without confirmation

### ❌ Not Implemented (Nice-to-have)

- **Fluture.js / Effect.js** - Using native Promises instead
- **Advanced clip grouping** - Not implemented
- **Audio waveform visualization** - Not needed for mock video
- **Export/Download** - Not implemented

## Project Structure

```
src/
├── components/
│   ├── layout/        # Header, Sidebar
│   ├── preview/       # Preview area, playback controls
│   ├── timeline/      # Timeline, tracks, clips
│   └── ui/            # shadcn/ui components
├── config/
│   └── api.js         # API configuration
├── services/
│   ├── projectsService.js  # REST API for projects
│   └── notesService.js     # GraphQL API for notes
├── stores/
│   ├── projectsStore.js    # Projects state
│   ├── timelineStore.js    # Timeline state
│   ├── notesStore.js       # Notes state
│   └── historyStore.js     # Undo/redo history
├── utils/
│   └── time.js            # Time formatting utilities
├── lib/
│   └── utils.js            # Utility functions (cn helper)
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
└── index.css               # Global styles with TailwindCSS
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

## Usage

1. **Create a Project**: Click "New Project" in the sidebar
2. **Add Tracks**: Click "Add Track" at the bottom
3. **Add Clips**: Click "+" on any track (clips are added at playhead position)
4. **Move Clips**: Drag clips horizontally on the timeline
5. **Select Clips**: Click a clip to select it
6. **Split Clips**: Select a clip and click "Split Clip" (splits at playhead)
7. **Delete Clips**: Select a clip and click "Delete Clip" button
8. **Delete Tracks**: Hover over track name and click "✕" button
9. **Playback**: Use play/pause button or click on timeline to scrub
10. **Zoom**: Use zoom controls in the timeline header (- / + buttons)
11. **Save**: Click "Save" in the header to persist changes
12. **Undo/Redo**: Use arrow buttons in the header

## API Integration

### REST API - Projects

- **Base URL**: `http://localhost:3000/api/projects`
- **Operations**:
  - `GET /api/projects` - List all projects
  - `POST /api/projects` - Create new project
  - `PUT /api/projects/:id` - Update project
  - `DELETE /api/projects/:id` - Delete project

Project structure:
```json
{
  "id": "unique-id",
  "data": {
    "name": "Project Name",
    "timeline": {
      "tracks": [...],
      "duration": 60
    }
  }
}
```

### GraphQL API - Notes

- **Endpoint**: `http://localhost:3000/graphql`
- **GraphiQL IDE**: `http://localhost:3000/graphql` (in browser)

Available queries:
- `notes(projectId)` - Get all notes for a project

Available mutations:
- `createNote(projectId, data)` - Create a new note
- `updateNote(id, data)` - Update a note
- `deleteNote(id)` - Delete a note

Note structure:
```json
{
  "id": "unique-id",
  "data": {
    "content": "Note content",
    "createdAt": "2024-01-28T..."
  }
}
```

See the mock-api README for detailed API documentation.
