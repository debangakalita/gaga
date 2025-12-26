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
  const { videos, addVideo, deleteVideo, updateVideo, loadVideosForDate, isLoading } = useVideoStore()
  
  // Load videos for selected date when it changes
  useEffect(() => {
    const dateKey = selectedDate.toLocaleDateString('en-CA')
    loadVideosForDate(dateKey)
  }, [selectedDate, loadVideosForDate])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleRecordVideo = () => {
    setIsRecordingModalOpen(true)
  }
  
  const handleVideoSaved = async (video) => {
    try {
      await addVideo(video)
    } catch (error) {
      console.error('Error saving video:', error)
    }
  }

  const handleUploadVideo = async (event) => {
    const file = event.target.files[0]
    if (file) {
      const dateKey = selectedDate.toLocaleDateString('en-CA')
      
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
      
      await addVideo(video)
    }
  }

  const handleDeleteVideo = (videoId) => {
    deleteVideo(videoId)
  }

  const handleUpdateVideo = async (videoId, updates) => {
    try {
      await updateVideo(videoId, updates)
    } catch (error) {
      console.error('Error updating video:', error)
    }
  }

  const handleRandomMoment = () => {
    const allVideos = Object.values(videos).flat()
    if (allVideos.length > 0) {
      const randomVideo = allVideos[Math.floor(Math.random() * allVideos.length)]
      window.open(randomVideo.url, '_blank')
    }
  }

  const dateKey = selectedDate.toLocaleDateString('en-CA')
  
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
        onUpdateVideo={handleUpdateVideo}
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
