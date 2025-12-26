import React, { useState, useRef, useEffect } from 'react'
import { Play, MoreVertical, Clock, Trash2, Download, Edit2 } from 'lucide-react'

const VideoThumbnail = ({ video, onDelete, onUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(video.filename || 'Video')
  const menuRef = useRef(null)
  const inputRef = useRef(null)
  
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

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = video.url
    link.download = video.filename || 'video.mp4'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setIsMenuOpen(false)
  }

  const handleDelete = () => {
    onDelete()
    setIsMenuOpen(false)
  }

  const handleRename = () => {
    setIsEditing(true)
    setIsMenuOpen(false)
  }

  const handleTitleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleTitleSave = () => {
    const trimmedTitle = editedTitle.trim()
    if (trimmedTitle && trimmedTitle !== video.filename) {
      onUpdate({ filename: trimmedTitle })
    } else if (!trimmedTitle) {
      setEditedTitle(video.filename || 'Video')
    }
    setIsEditing(false)
  }

  const handleTitleCancel = () => {
    setEditedTitle(video.filename || 'Video')
    setIsEditing(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSave()
    } else if (e.key === 'Escape') {
      handleTitleCancel()
    }
  }

  // Update editedTitle when video.filename changes
  useEffect(() => {
    setEditedTitle(video.filename || 'Video')
  }, [video.filename])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])
  
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
      {/* Video Preview */}
      <div className="relative aspect-video bg-gray-200">
        <video
          src={video.url}
          className="w-full h-full object-cover"
          preload="none"
          loading="lazy"
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
        

        
        {/* Kebab Menu */}
        <div className="absolute top-2 right-2" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsMenuOpen(!isMenuOpen)
            }}
            className="w-8 h-8 bg-white bg-opacity-50 hover:bg-opacity-70 text-gray-700 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-md"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRename()
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Rename</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Video Info */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={handleTitleKeyDown}
              className="text-sm font-medium text-gray-800 bg-white border border-blue-500 rounded px-2 py-1 flex-1 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <span
              onDoubleClick={handleTitleDoubleClick}
              className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:text-blue-600 transition-colors"
              title="Double-click to rename"
            >
              {video.filename || 'Video'}
            </span>
          )}
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
