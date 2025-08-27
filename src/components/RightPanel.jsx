import React from 'react'
import { Play, Trash2 } from 'lucide-react'
import VideoThumbnail from './VideoThumbnail'

const RightPanel = ({ selectedDate, videos, onDeleteVideo, onOpenModal }) => {
  const todayVideos = videos || []
  
  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center border-b border-gray-200">
        <div className="px-6 flex items-center justify-end w-full">
          {todayVideos.length > 0 && (
            <button
              onClick={onOpenModal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Make Movie
            </button>
          )}
        </div>
      </div>
      
      {/* Video Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        {todayVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Play className="w-8 h-8" />
            </div>
            <p className="text-lg font-medium mb-2">No videos today</p>
            <p className="text-sm text-gray-400">Record or upload a video to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {todayVideos.map((video) => (
              <VideoThumbnail
                key={video.id}
                video={video}
                onDelete={() => onDeleteVideo(video.id)}
              />
            ))}
          </div>
        )}
      </div>
      

    </div>
  )
}

export default RightPanel
