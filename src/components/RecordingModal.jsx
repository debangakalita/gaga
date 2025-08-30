import React, { useState, useRef, useEffect } from 'react'
import { X, Video, Square } from 'lucide-react'

const RecordingModal = ({ isOpen, onClose, onSave, selectedDate }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedChunks, setRecordedChunks] = useState([])
  const [stream, setStream] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)
  const [error, setError] = useState('')
  
  const videoRef = useRef(null)
  const timerRef = useRef(null)
  
  useEffect(() => {
    if (isOpen) {
      startCamera()
    } else {
      stopCamera()
    }
    
    return () => {
      stopCamera()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isOpen])
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      setStream(mediaStream)
      setError('')
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Unable to access camera and microphone. Please check permissions.')
      console.error('Error accessing media devices:', err)
    }
  }
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }
  
  const startRecording = () => {
    if (!stream) return
    
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    const chunks = []
    
    recorder.ondataavailable = (event) => {
      chunks.push(event.data)
    }
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      const dateKey = selectedDate.toLocaleDateString('en-CA')
      console.log('Recording video for date:', dateKey, 'Selected date:', selectedDate)
      const video = {
        id: Date.now().toString(),
        blob, // Store the blob for IndexedDB
        date: dateKey,
        timestamp: new Date().toISOString(),
        type: 'recorded'
      }
      
      // Save video and close modal
      onSave(video)
      onClose()
    }
    
    recorder.start()
    setMediaRecorder(recorder)
    setIsRecording(true)
  }
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }
  

  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Record Video</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          {/* Video Preview */}
          <div className="mb-6">
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">
                    RECORDING
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Recording Controls */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {!isRecording && (
              <button
                onClick={startRecording}
                disabled={!stream}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Video className="w-5 h-5" />
                <span>Start Recording</span>
              </button>
            )}
            
            {isRecording && (
              <button
                onClick={stopRecording}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Square className="w-5 h-5" />
                <span>Stop Recording</span>
              </button>
            )}
          </div>
          

        </div>
      </div>
    </div>
  )
}

export default RecordingModal
