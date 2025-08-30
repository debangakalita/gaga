import React, { useState, useEffect } from 'react'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import MakeMovieModal from './components/MakeMovieModal'
import RecordingModal from './components/RecordingModal'
import { useVideoStore } from './stores/videoStore'
import { videoStorage } from './services/videoStorage'

function App() {
  // Initialize with today's date at midnight in local timezone
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false)
  const { videos, addVideo, deleteVideo, initializeVideos, isLoading } = useVideoStore()
  
  // Initialize videos from IndexedDB when app loads
  useEffect(() => {
    initializeVideos()
  }, [initializeVideos])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleRecordVideo = () => {
    setIsRecordingModalOpen(true)
  }
  
  const handleVideoSaved = async (video) => {
    try {
      await addVideo(video)
      console.log('Video saved and store updated')
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const handleUploadVideo = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const dateKey = selectedDate.toLocaleDateString('en-CA')
      console.log('Uploading video for date:', dateKey, 'Selected date:', selectedDate)
      
      // Convert file to blob for storage
      const blob = await videoStorage.fileToBlob(file)
      
      // Get current video count for this date to generate clip number
      const currentVideos = videos[dateKey] || []
      const clipNumber = currentVideos.length + 1
      
      const video = {
        id: Date.now().toString(),
        blob, // Store the blob for IndexedDB
        date: dateKey,
        timestamp: new Date().toISOString(),
        type: 'uploaded',
        filename: `Clip ${clipNumber}`
      }
      
      console.log('About to add video:', video)
      await addVideo(video)
      console.log('Video added, refreshing...')
      
      // Manually refresh videos to ensure UI updates
      setTimeout(() => {
        console.log('Refreshing videos...')
        initializeVideos()
      }, 500)
    }
  }

  const handleDeleteVideo = (videoId) => {
    deleteVideo(videoId)
  }

  const handleRandomMoment = () => {
    const allVideos = Object.values(videos).flat()
    if (allVideos.length > 0) {
      const randomVideo = allVideos[Math.floor(Math.random() * allVideos.length)]
      window.open(randomVideo.url, '_blank')
    }
  }

  const dateKey = selectedDate.toLocaleDateString('en-CA')
  console.log('App render - Date key:', dateKey, 'Selected date:', selectedDate, 'Available video dates:', Object.keys(videos), 'Videos for current date:', videos[dateKey])
  
  return (
    <div className="flex h-screen font-inter">
      <LeftPanel
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onRecordVideo={handleRecordVideo}
        onUploadVideo={handleUploadVideo}
        videos={videos[dateKey] || []}
      />
      <RightPanel
        selectedDate={selectedDate}
        videos={videos[dateKey] || []}
        onDeleteVideo={handleDeleteVideo}
        onOpenModal={() => setIsModalOpen(true)}
        isLoading={isLoading}
      />
      <MakeMovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videos={videos[dateKey] || []}
        selectedDate={selectedDate}
      />
      <RecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onSave={handleVideoSaved}
        selectedDate={selectedDate}
        currentVideoCount={(videos[dateKey] || []).length}
      />
      {/* Debug info */}
      {isRecordingModalOpen && (
        <div className="fixed top-4 right-4 bg-black text-white p-2 text-xs z-50">
          Debug: Date: {dateKey}, Videos: {(videos[dateKey] || []).length}
        </div>
      )}
    </div>
  )
}

export default App
