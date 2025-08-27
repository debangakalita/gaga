import React, { useState, useEffect } from 'react'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import MakeMovieModal from './components/MakeMovieModal'
import RecordingModal from './components/RecordingModal'
import { useVideoStore } from './stores/videoStore'

function App() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false)
  const { videos, addVideo, deleteVideo } = useVideoStore()

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleRecordVideo = () => {
    setIsRecordingModalOpen(true)
  }

  const handleUploadVideo = (event) => {
    const file = event.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      const video = {
        id: Date.now().toString(),
        url,
        date: selectedDate.toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        type: 'uploaded',
        filename: file.name
      }
      addVideo(video)
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

  return (
    <div className="flex h-screen font-inter">
      <LeftPanel
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onRecordVideo={handleRecordVideo}
        onUploadVideo={handleUploadVideo}
        videos={videos[selectedDate.toISOString().split('T')[0]] || []}
      />
      <RightPanel
        selectedDate={selectedDate}
        videos={videos[selectedDate.toISOString().split('T')[0]] || []}
        onDeleteVideo={handleDeleteVideo}
        onOpenModal={() => setIsModalOpen(true)}
        onRandomMoment={handleRandomMoment}
      />
      <MakeMovieModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videos={videos[selectedDate.toISOString().split('T')[0]] || []}
        selectedDate={selectedDate}
      />
      <RecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onSave={addVideo}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default App
