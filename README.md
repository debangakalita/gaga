# Gaga Video Diary

A daily video diary application built with React and Tailwind CSS, featuring video recording, upload, and movie creation capabilities.

## Features

### 🎥 Daily Video Diary
- **Record Videos**: Capture video clips directly in the browser
- **Upload Videos**: Import existing video files
- **Date-based Storage**: All videos are organized by date

### 📅 Calendar View (Left Panel)
- **Compact Calendar**: Always visible without scrolling (~220px height)
- **Date Selection**: Click any date to view its videos
- **Daily Summary**: Shows video count and previews for selected day

### 🎬 Daily Videos (Right Panel)
- **2x2 Grid Layout**: Display all clips for the selected day
- **Video Previews**: Click to play videos in full-screen modal
- **Delete Functionality**: Remove unwanted videos

### 🎭 Make Movie
- **Video Selection**: Choose which clips to include
- **Drag & Drop Reordering**: Change sequence of clips
- **Export Functionality**: Create final movie (MVP version)

### 🎲 Random Moment
- **Surprise Playback**: Button at bottom right to play random clips

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand with local storage persistence
- **Font**: Inter (Google Fonts)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── LeftPanel.jsx          # Calendar and controls
│   ├── RightPanel.jsx         # Video grid and movie button
│   ├── CompactCalendar.jsx    # Date picker component
│   ├── VideoThumbnail.jsx     # Individual video display
│   └── MakeMovieModal.jsx     # Movie creation interface
├── stores/
│   └── videoStore.js          # Zustand store for video state
├── App.jsx                    # Main application component
├── main.jsx                   # Application entry point
└── index.css                  # Global styles and Tailwind
```

## UI/UX Guidelines

- **Layout**: Two-panel design with fixed left panel (~280px) and flexible right panel
- **Responsive**: Works on desktop, tablet, and mobile
- **Minimal Styling**: Clean, modern interface with Inter font
- **100% Viewport Height**: No scrolling required for left panel
- **Color Scheme**: Minimal grays and blues (styling to be enhanced later)

## Browser Compatibility

- Modern browsers with MediaRecorder API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires camera and microphone permissions for recording

## Future Enhancements

- Advanced video trimming capabilities
- Video effects and filters
- Cloud storage integration
- Social sharing features
- Mobile app version

## License

MIT License
