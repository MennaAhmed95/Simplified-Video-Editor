# Video Editor - Frontend Application

A simplified video editor application built with React, featuring a multi-track timeline, clip management, and project persistence.

## Stack

- **React 18+** (v19.2.3)
- **TailwindCSS v3+** (v3.4.19)
- **shadcn/ui** - Component library
- **Zustand** - State management (simpler, less boilerplate)
- **Ramda** - Functional programming utilities
- **Vite** - Build tool

## Getting Started

### Prerequisites

1. Start the mock API server (in `../mock-api/`):
```bash
cd ../mock-api
npm install
npm start
```

The API server will run on `http://localhost:3000`

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

✅ **Multi-track Timeline** - Add video, audio, and background tracks
✅ **Clip Management** - Add, move, split, and delete clips
✅ **Playhead Control** - Scrub through timeline, play/pause
✅ **Project Management** - Create, save, and load projects
✅ **Notes System** - Add notes to projects (GraphQL)
✅ **Undo/Redo** - Full history support
✅ **Timeline Zoom** - Zoom in/out for precise editing

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
3. **Add Clips**: Click "Add Clip" on any track (clips are added at playhead position)
4. **Move Clips**: Drag clips horizontally on the timeline
5. **Split Clips**: Select a clip and click "Split Clip" (splits at playhead)
6. **Playback**: Use play/pause button or scrub the timeline
7. **Save**: Click "Save" in the header to persist changes
8. **Undo/Redo**: Use arrow buttons in the header

## API Integration

- **Projects**: REST API at `http://localhost:3000/api/projects`
- **Notes**: GraphQL API at `http://localhost:3000/graphql`

See the mock-api README for API documentation.
