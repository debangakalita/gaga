import React from 'react'
import { Play, Shuffle, Trash2 } from 'lucide-react'
import VideoThumbnail from './VideoThumbnail'

const RightPanel = ({ selectedDate, videos, onDeleteVideo, onOpenModal, onRandomMoment }) => {
  const todayVideos = videos || []
  
  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Watch Movie</h2>
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
      
      {/* Random Moment Button */}
      <div className="p-6 border-t border-gray-200">
        <button
          onClick={onRandomMoment}
          disabled={todayVideos.length === 0}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Shuffle className="w-5 h-5" />
          <span>Random Moment</span>
        </button>
      </div>
    </div>
  )
}

export default RightPanel
