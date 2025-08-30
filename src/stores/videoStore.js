import { create } from 'zustand'
import { videoStorage } from '../services/videoStorage'

export const useVideoStore = create((set, get) => ({
  videos: {},
  isLoading: false,
  
  // Initialize videos from IndexedDB
  initializeVideos: async () => {
    try {
      set({ isLoading: true })
      const allVideos = await videoStorage.getAllVideos()
      console.log('All videos from IndexedDB:', allVideos)
      
      // Group videos by date
      const videosByDate = {}
      allVideos.forEach(video => {
        if (!videosByDate[video.date]) {
          videosByDate[video.date] = []
        }
        videosByDate[video.date].push(video)
      })
      
      console.log('Videos grouped by date:', videosByDate)
      set({ videos: videosByDate, isLoading: false })
    } catch (error) {
      console.error('Error initializing videos:', error)
      set({ isLoading: false })
    }
  },
  
  addVideo: async (video) => {
    try {
      console.log('Adding video to store:', video)
      
      // Save to IndexedDB
      const savedVideo = await videoStorage.saveVideo(video)
      console.log('Video saved to IndexedDB:', savedVideo)
      
      // Create video object with proper URL for immediate display
      const videoForDisplay = {
        ...savedVideo,
        url: video.blob ? URL.createObjectURL(video.blob) : savedVideo.url
      }
      console.log('Video for display:', videoForDisplay)
      
      // Update local state immediately
      set((state) => {
        const date = videoForDisplay.date
        const existingVideos = state.videos[date] || []
        const newState = {
          videos: {
            ...state.videos,
            [date]: [...existingVideos, videoForDisplay]
          }
        }
        console.log('New store state:', newState)
        return newState
      })
      
      // Return the saved video for confirmation
      return videoForDisplay
    } catch (error) {
      console.error('Error adding video:', error)
      throw error
    }
  },
  
  deleteVideo: async (videoId) => {
    try {
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
  }
}))
