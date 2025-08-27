import React from 'react'
import { Calendar, Video, Upload, Mic } from 'lucide-react'
import CompactCalendar from './CompactCalendar'

const LeftPanel = ({ selectedDate, onDateSelect, onRecordVideo, onUploadVideo, videos }) => {
  const todayVideos = videos || []
  
  return (
    <div className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Title */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Video Diary</h1>
      </div>
      
      {/* Calendar */}
      <div className="p-4">
        <CompactCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>
      
      {/* Daily Entry Card */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-medium text-gray-800 mb-2">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {todayVideos.length} video{todayVideos.length !== 1 ? 's' : ''} today
          </p>
          {todayVideos.length > 0 && (
            <div className="space-y-2">
              {todayVideos.slice(0, 3).map((video) => (
                <div key={video.id} className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600 truncate">
                    {video.type === 'recorded' ? 'Recorded' : video.filename}
                  </span>
                </div>
              ))}
              {todayVideos.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{todayVideos.length - 3} more
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Record Button */}
      <div className="px-4 mb-3">
        <button
          onClick={onRecordVideo}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <Mic className="w-5 h-5" />
          <span>Record Video</span>
        </button>
      </div>
      
      {/* Upload Button */}
      <div className="px-4">
        <label className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer">
          <Upload className="w-5 h-5" />
          <span>Upload Video</span>
          <input
            type="file"
            accept="video/*"
            onChange={onUploadVideo}
            className="hidden"
          />
        </label>
      </div>
    </div>
  )
}

export default LeftPanel
