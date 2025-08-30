import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CompactCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))
  
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  
  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    onDateSelect(today)
  }
  
  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear()
  }
  
  const isSelected = (day) => {
    return day === selectedDate.getDate() && 
           currentMonth.getMonth() === selectedDate.getMonth() && 
           currentMonth.getFullYear() === selectedDate.getFullYear()
  }
  
  const handleDateClick = (day) => {
    // Create date at midnight in local timezone to avoid timezone issues
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day, 0, 0, 0, 0)
    onDateSelect(newDate)
  }
  
  const renderCalendarDays = () => {
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`w-6 h-6 rounded-full text-[10px] font-medium transition-colors ${
            isToday(day)
              ? 'bg-[#7E7E7E] text-white'
              : isSelected(day)
              ? 'bg-gray-200 text-gray-800'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      )
    }
    
    return days
  }
  
  return (
    <div className="bg-[#D9D9D9] p-4 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={goToPreviousMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="text-center">
          <h3 className="font-semibold text-gray-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map((day, index) => (
          <div key={`day-${index}`} className="w-6 h-6 flex items-center justify-center text-[10px] font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      

    </div>
  )
}

export default CompactCalendar
