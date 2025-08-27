import React, { useState, useEffect } from 'react'
import { Calendar, Video, Upload, Mic } from 'lucide-react'
import CompactCalendar from './CompactCalendar'

const LeftPanel = ({ selectedDate, onDateSelect, onRecordVideo, onUploadVideo, videos }) => {
  const todayVideos = videos || []
  const [dayTitle, setDayTitle] = useState('')
  const [dayDescription, setDayDescription] = useState('')
  
  // Load saved title and description for the selected date
  useEffect(() => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    const savedData = localStorage.getItem(`day-${dateKey}`)
    if (savedData) {
      const { title, description } = JSON.parse(savedData)
      setDayTitle(title || '')
      setDayDescription(description || '')
    } else {
      setDayTitle('')
      setDayDescription('')
    }
  }, [selectedDate])
  
  // Save title and description when they change
  const saveDayData = (title, description) => {
    const dateKey = selectedDate.toISOString().split('T')[0]
    localStorage.setItem(`day-${dateKey}`, JSON.stringify({ title, description }))
  }
  
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setDayTitle(newTitle)
    saveDayData(newTitle, dayDescription)
  }
  
  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value
    setDayDescription(newDescription)
    saveDayData(dayTitle, newDescription)
  }
  
  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Title */}
      <div className="h-14 flex items-center border-b border-gray-200">
        <div className="px-8">
          <h1 className="text-lg font-semibold text-gray-800">HowWasYourDay?</h1>
        </div>
      </div>
      
      {/* Calendar */}
      <div className="p-6">
        <CompactCalendar
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>
      
      {/* Daily Entry Card */}
      <div className="px-6 mb-6">
        <div className="bg-white p-6 border border-gray-200">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Give your day a title..."
              className="w-full text-lg font-medium text-gray-800 bg-transparent border-none outline-none placeholder-gray-400 focus:placeholder-gray-300 transition-colors"
              value={dayTitle}
              onChange={handleTitleChange}
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Add some notes about your day..."
              className="w-full text-sm text-gray-600 bg-transparent border-none outline-none resize-none placeholder-gray-400 focus:placeholder-gray-300 transition-colors"
              rows="3"
              value={dayDescription}
              onChange={handleDescriptionChange}
            />
          </div>
          {todayVideos.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Today's videos:</p>
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
            </div>
          )}
        </div>
      </div>
      
      {/* Record Button */}
      <div className="px-6 mb-4">
        <button
          onClick={onRecordVideo}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-colors"
        >
          <Mic className="w-6 h-6" />
          <span>Record Video</span>
        </button>
      </div>
      
      {/* Upload Button */}
      <div className="px-6">
        <label className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-colors cursor-pointer">
          <Upload className="w-6 h-6" />
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
