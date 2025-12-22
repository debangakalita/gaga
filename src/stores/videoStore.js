import { create } from 'zustand'
import { videoStorage } from '../services/videoStorage'

export const useVideoStore = create((set, get) => ({
  videos: {},
  isLoading: false,
  loadedDates: new Set(), // Track which dates have been loaded
  watchedMovies: JSON.parse(localStorage.getItem('watchedMovies') || '{}'),
  
  // Load videos for a specific date (lazy loading)
  loadVideosForDate: async (date) => {
    const dateKey = typeof date === 'string' ? date : date.toLocaleDateString('en-CA')
    
    // Skip if already loaded
    if (get().loadedDates.has(dateKey)) {
      return
    }
    
    try {
      set({ isLoading: true })
      const videos = await videoStorage.getVideosByDate(dateKey)
      
      set((state) => {
        const newLoadedDates = new Set(state.loadedDates)
        newLoadedDates.add(dateKey)
        
        return {
          videos: {
            ...state.videos,
            [dateKey]: videos
          },
          loadedDates: newLoadedDates,
          isLoading: false
        }
      })
    } catch (error) {
      console.error('Error loading videos for date:', error)
      set({ isLoading: false })
    }
  },
  
  addVideo: async (video) => {
    try {
      // Save to IndexedDB
      const savedVideo = await videoStorage.saveVideo(video)
      
      // Create video object with proper URL for immediate display
      const videoForDisplay = {
        ...savedVideo,
        url: video.blob ? URL.createObjectURL(video.blob) : savedVideo.url
      }
      
      // Update local state immediately
      set((state) => {
        const date = videoForDisplay.date
        const existingVideos = state.videos[date] || []
        
        // Mark this date as loaded
        const newLoadedDates = new Set(state.loadedDates)
        newLoadedDates.add(date)
        
        return {
          videos: {
            ...state.videos,
            [date]: [...existingVideos, videoForDisplay]
          },
          loadedDates: newLoadedDates
        }
      })
      
      return videoForDisplay
    } catch (error) {
      console.error('Error adding video:', error)
      throw error
    }
  },
  
  deleteVideo: async (videoId) => {
    try {
      // Get video before deleting to revoke URL
      const state = get()
      let videoToDelete = null
      Object.keys(state.videos).forEach(date => {
        const video = state.videos[date].find(v => v.id === videoId)
        if (video) {
          videoToDelete = video
        }
      })
      
      // Revoke object URL to free memory
      if (videoToDelete && videoToDelete.url) {
        URL.revokeObjectURL(videoToDelete.url)
      }
      
      // Delete from IndexedDB
      await videoStorage.deleteVideo(videoId)
      
      // Update local state
      set((state) => {
        const newVideos = {}
        Object.keys(state.videos).forEach(date => {
          newVideos[date] = state.videos[date].filter(v => v.id !== videoId)
        })
        return { videos: newVideos }
      })
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  },
  
  updateVideo: async (videoId, updates) => {
    try {
      // Get current video to update
      const currentVideos = get().videos
      let videoToUpdate = null
      let videoDate = null
      
      Object.keys(currentVideos).forEach(date => {
        const video = currentVideos[date].find(v => v.id === videoId)
        if (video) {
          videoToUpdate = { ...video, ...updates }
          videoDate = date
        }
      })
      
      if (videoToUpdate) {
        // Update in IndexedDB
        await videoStorage.saveVideo(videoToUpdate)
        
        // Update local state
        set((state) => {
          const newVideos = { ...state.videos }
          newVideos[videoDate] = newVideos[videoDate].map(v => 
            v.id === videoId ? videoToUpdate : v
          )
          return { videos: newVideos }
        })
      }
    } catch (error) {
      console.error('Error updating video:', error)
    }
  },
  
  clearVideos: async () => {
    try {
      await videoStorage.clearAllVideos()
      set({ videos: {} })
    } catch (error) {
      console.error('Error clearing videos:', error)
    }
  },
  
  // Mark a date as having a watched movie
  markMovieWatched: (date) => {
    set((state) => {
      const newWatchedMovies = {
        ...state.watchedMovies,
        [date]: true
      }
      // Save to localStorage
      localStorage.setItem('watchedMovies', JSON.stringify(newWatchedMovies))
      return { watchedMovies: newWatchedMovies }
    })
  },
  
  // Check if a movie has been watched for a specific date
  hasWatchedMovie: (date) => {
    const state = get()
    return state.watchedMovies && state.watchedMovies[date] === true
  }
}))
