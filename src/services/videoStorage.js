class VideoStorageService {
  constructor() {
    this.dbName = 'VideoDiaryDB'
    this.dbVersion = 1
    this.storeName = 'videos'
    this.db = null
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('date', 'date', { unique: false })
          store.createIndex('type', 'type', { unique: false })
        }
      }
    })
  }

  async saveVideo(video) {
    if (!this.db) await this.initDB()
    
    console.log('Saving video to IndexedDB:', video)
    
    // Convert video blob to ArrayBuffer first, then save
    if (video.blob) {
      try {
        const arrayBuffer = await this.blobToArrayBuffer(video.blob)
        const videoData = {
          ...video,
          blobData: arrayBuffer,
          url: null // Remove the temporary URL
        }
        
        console.log('Video data to store:', videoData)
        
        // Now save to IndexedDB
        return await this.saveToIndexedDB(videoData)
      } catch (error) {
        console.error('Error processing blob:', error)
        throw error
      }
    } else {
      // For videos without blob (e.g., from file input)
      console.log('Saving video without blob:', video)
      return await this.saveToIndexedDB(video)
    }
  }
  
  // Helper method to convert blob to ArrayBuffer
  blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(blob)
    })
  }
  
  // Helper method to save to IndexedDB
  saveToIndexedDB(videoData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      const request = store.put(videoData)
      request.onsuccess = () => {
        console.log('Video successfully saved to IndexedDB')
        resolve(videoData)
      }
      request.onerror = () => {
        console.error('Error saving video to IndexedDB:', request.error)
        reject(request.error)
      }
    })
  }

  async getVideosByDate(date) {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const index = store.index('date')
      const request = index.getAll(date)
      
      request.onsuccess = () => {
        console.log('Retrieved videos from IndexedDB:', request.result)
        const videos = request.result.map(video => {
          let url
          if (video.blobData) {
            url = URL.createObjectURL(new Blob([video.blobData], { type: 'video/webm' }))
            console.log('Created URL from blob:', url)
          } else if (video.blob) {
            url = URL.createObjectURL(video.blob)
            console.log('Created URL from blob object:', url)
          } else {
            url = video.url
            console.log('Using existing URL:', url)
          }
          
          return {
            ...video,
            url
          }
        })
        console.log('Processed videos with URLs:', videos)
        resolve(videos)
      }
      
      request.onerror = () => reject(request.error)
    })
  }

  async getAllVideos() {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()
      
      request.onsuccess = () => {
        console.log('Retrieved all videos from IndexedDB:', request.result)
        const videos = request.result.map(video => {
          let url
          if (video.blobData) {
            url = URL.createObjectURL(new Blob([video.blobData], { type: 'video/webm' }))
          } else if (video.blob) {
            url = URL.createObjectURL(video.blob)
          } else {
            url = video.url
          }
          
          return {
            ...video,
            url
          }
        })
        console.log('Processed all videos with URLs:', videos)
        resolve(videos)
      }
      
      request.onerror = () => reject(request.error)
    })
  }

  async deleteVideo(videoId) {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(videoId)
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clearAllVideos() {
    if (!this.db) await this.initDB()
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.clear()
      
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Helper method to convert File to Blob for storage
  fileToBlob(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const blob = new Blob([reader.result], { type: file.type })
        resolve(blob)
      }
      reader.readAsArrayBuffer(file)
    })
  }
}

export const videoStorage = new VideoStorageService()
