import React, { useState } from 'react'
import { X, Play } from 'lucide-react'
import { useVideoStore } from '../stores/videoStore'

const MakeMovieModal = ({ isOpen, onClose, videos, selectedDate }) => {
  const [selectedSequence, setSelectedSequence] = useState([]) // Array of video IDs in click order
  const { markMovieWatched } = useVideoStore()
  
  React.useEffect(() => {
    // Reset sequence when modal opens
    if (isOpen) {
      setSelectedSequence([])
    }
  }, [isOpen])
  
  const handleVideoClick = (videoId) => {
    setSelectedSequence(prev => {
      // If video is already in sequence, remove it
      if (prev.includes(videoId)) {
        return prev.filter(id => id !== videoId)
      }
      // Otherwise, add it to the end (maintaining click order)
      return [...prev, videoId]
    })
  }
  
  const handleWatchMovie = () => {
    // Map sequence IDs to actual video objects in order
    const selectedVideosForMovie = selectedSequence
      .map(videoId => videos.find(v => v.id === videoId))
      .filter(Boolean) // Remove any undefined entries
    
    if (selectedVideosForMovie.length === 0) {
      alert('Please select at least one video to watch')
      return
    }
    
    // Create a fullscreen video player
    const moviePlayer = document.createElement('div')
    moviePlayer.className = 'fixed inset-0 bg-black z-50'
    moviePlayer.style.zIndex = '9999'
    
    const videoElement = document.createElement('video')
    videoElement.controls = true
    videoElement.style.width = '100vw'
    videoElement.style.height = '100vh'
    videoElement.style.objectFit = 'contain'
    videoElement.autoplay = true
    
    // Add close button
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '✕'
    closeButton.className = 'absolute top-4 right-4 w-12 h-12 bg-black bg-opacity-50 text-white text-2xl font-bold rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all z-10'
    closeButton.onclick = () => {
      document.body.removeChild(moviePlayer)
      if (document.fullscreenElement) {
        document.exitFullscreen()
      }
    }
    
    // Add navigation arrows
    const prevButton = document.createElement('button')
    prevButton.innerHTML = '‹'
    prevButton.className = 'absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black bg-opacity-50 text-white text-4xl font-bold rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all z-10'
    prevButton.onclick = () => {
      if (currentVideoIndex > 0) {
        currentVideoIndex--
        isTransitioning = false
        playNextVideo()
      }
    }
    
    const nextButton = document.createElement('button')
    nextButton.innerHTML = '›'
    nextButton.className = 'absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-black bg-opacity-50 text-white text-4xl font-bold rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all z-10'
    nextButton.onclick = () => {
      if (currentVideoIndex < selectedVideosForMovie.length - 1) {
        currentVideoIndex++
        isTransitioning = false
        playNextVideo()
      }
    }
    
    // Update navigation buttons visibility
    const updateNavButtons = () => {
      prevButton.style.display = currentVideoIndex > 0 ? 'flex' : 'none'
      nextButton.style.display = currentVideoIndex < selectedVideosForMovie.length - 1 ? 'flex' : 'none'
    }
    
    // Create a playlist system that plays videos seamlessly
    let currentVideoIndex = 0
    let isTransitioning = false
    
    const playNextVideo = () => {
      if (currentVideoIndex >= selectedVideosForMovie.length) {
        // All videos played, loop back to first
        currentVideoIndex = 0
      }
      
      if (!isTransitioning) {
        const video = selectedVideosForMovie[currentVideoIndex]
        videoElement.src = video.url
        
        // Add a small crossfade effect
        videoElement.style.opacity = '0'
        videoElement.style.transition = 'opacity 0.3s ease-in-out'
        
        videoElement.oncanplay = () => {
          videoElement.play()
          videoElement.style.opacity = '1'
          updateNavButtons() // Update navigation buttons
        }
        
        videoElement.onended = () => {
          isTransitioning = true
          currentVideoIndex++
          setTimeout(() => {
            isTransitioning = false
            playNextVideo()
          }, 100) // Small delay for smooth transition
        }
      }
    }
    
    // Start playing
    playNextVideo()
    
    // Mark this movie as watched for the selected date
    const dateKey = selectedDate.toLocaleDateString('en-CA')
    markMovieWatched(dateKey)
    
    // Add elements to the player
    moviePlayer.appendChild(videoElement)
    moviePlayer.appendChild(closeButton)
    moviePlayer.appendChild(prevButton)
    moviePlayer.appendChild(nextButton)
    document.body.appendChild(moviePlayer)
    
    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen()
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen()
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen()
    }
    
    // Add keyboard navigation
    const handleKeyPress = (event) => {
      switch(event.key) {
        case 'ArrowLeft':
          if (currentVideoIndex > 0) {
            currentVideoIndex--
            isTransitioning = false
            playNextVideo()
          }
          break
        case 'ArrowRight':
          if (currentVideoIndex < selectedVideosForMovie.length - 1) {
            currentVideoIndex++
            isTransitioning = false
            playNextVideo()
          }
          break
        case 'Escape':
          document.body.removeChild(moviePlayer)
          if (document.fullscreenElement) {
            document.exitFullscreen()
          }
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    
    // Clean up event listener when closing
    const originalCloseButton = closeButton.onclick
    closeButton.onclick = () => {
      document.removeEventListener('keydown', handleKeyPress)
      originalCloseButton()
    }
    
    onClose()
  }
  
  if (!isOpen) return null
  
  const selectedCount = selectedSequence.length
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-800">Create Movie</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Click videos in the order you want them to appear in your movie
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Date Info */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </h3>
          </div>
          
          {/* Video Grid */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Select Videos</h4>
            <div className="grid grid-cols-2 gap-4">
              {videos.map((video) => {
                const sequenceIndex = selectedSequence.indexOf(video.id)
                const isSelected = sequenceIndex !== -1
                const sequenceNumber = isSelected ? sequenceIndex + 1 : null
                
                return (
                  <div
                    key={video.id}
                    onClick={() => handleVideoClick(video.id)}
                    className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {/* Video Thumbnail */}
                    <div className="relative aspect-video bg-gray-200">
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                        preload="none"
                        loading="lazy"
                      />
                      {/* Sequence Number Badge */}
                      {isSelected && (
                        <div className="absolute top-2 left-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg">
                          {sequenceNumber}
                        </div>
                      )}
                      {/* Overlay for unselected videos */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all" />
                      )}
                    </div>
                    
                    {/* Video Info */}
                    <div className="p-3">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {video.filename || 'Video'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(video.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedCount > 0 ? (
              <span>{selectedCount} video{selectedCount !== 1 ? 's' : ''} selected</span>
            ) : (
              <span className="text-gray-400">Click videos to add them to your movie</span>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleWatchMovie}
              disabled={selectedCount === 0}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Create Movie</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MakeMovieModal
