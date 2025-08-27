import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useVideoStore = create(
  persist(
    (set, get) => ({
      videos: {},
      
      addVideo: (video) => {
        set((state) => {
          const date = video.date
          const existingVideos = state.videos[date] || []
          return {
            videos: {
              ...state.videos,
              [date]: [...existingVideos, video]
            }
          }
        })
      },
      
      deleteVideo: (videoId) => {
        set((state) => {
          const newVideos = {}
          Object.keys(state.videos).forEach(date => {
            newVideos[date] = state.videos[date].filter(v => v.id !== videoId)
          })
          return { videos: newVideos }
        })
      },
      
      updateVideo: (videoId, updates) => {
        set((state) => {
          const newVideos = {}
          Object.keys(state.videos).forEach(date => {
            newVideos[date] = state.videos[date].map(v => 
              v.id === videoId ? { ...v, ...updates } : v
            )
          })
          return { videos: newVideos }
        })
      },
      
      clearVideos: () => {
        set({ videos: {} })
      }
    }),
    {
      name: 'video-storage',
    }
  )
)
