import React, { useState } from 'react'
import { Play, Trash2, Clock } from 'lucide-react'

const VideoThumbnail = ({ video, onDelete }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const handlePlay = () => {
    setIsPlaying(true)
    const videoElement = document.createElement('video')
    videoElement.src = video.url
    videoElement.controls = true
    videoElement.style.width = '100%'
    videoElement.style.height = '100%'
    
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50'
    modal.onclick = () => {
      document.body.removeChild(modal)
      setIsPlaying(false)
    }
    
    const videoContainer = document.createElement('div')
    videoContainer.className = 'max-w-4xl max-h-[80vh]'
    videoContainer.onclick = (e) => e.stopPropagation()
    
    videoContainer.appendChild(videoElement)
    modal.appendChild(videoContainer)
    document.body.appendChild(modal)
    
    videoElement.play()
  }
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }
  
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {/* Video Preview */}
      <div className="relative aspect-video bg-gray-200">
        <video
          src={video.url}
          className="w-full h-full object-cover"
          preload="metadata"
        />
        
        {/* Play Button Overlay */}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all group"
        >
          <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-gray-800 ml-1" />
          </div>
        </button>
        

        
        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Video Info */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800 truncate">
            {video.filename || 'Video'}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            <span>{formatTime(video.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoThumbnail
