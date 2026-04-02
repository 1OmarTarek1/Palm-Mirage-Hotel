import React, { useState } from 'react';
import { Minus, Plus } from "lucide-react";

const DatePicker = ({ checkIn, checkOut, setBookingState, setActivePopover }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(new Date(checkIn || today));
  
  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));

  const handleDateClick = (day) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (selectedDate < today) return;

    if (!checkIn || (checkIn && checkOut)) {
      setBookingState(prev => ({ ...prev, checkIn: selectedDate, checkOut: null }));
    } else if (selectedDate > checkIn) {
      setBookingState(prev => ({ ...prev, checkOut: selectedDate }));
      setActivePopover(null); 
    } else {
      setBookingState(prev => ({ ...prev, checkIn: selectedDate, checkOut: null }));
    }
  };

  const isCheckIn = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
    return d === checkIn?.toDateString();
  };

  const isCheckOut = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
    return d === checkOut?.toDateString();
  };

  const isInRange = (day) => {
    if (!checkIn || !checkOut) return false;
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d > checkIn && d < checkOut;
  };

  const isPast = (day) => {
    const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return d < today;
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();
  const hasRange = checkIn && checkOut;

  return (
    <div className="p-4 w-full md:w-[320px] max-w-[calc(100vw-32px)] mx-auto">
      <div className="flex items-center justify-between mb-4 px-2">
        <button 
          onClick={(e) => { e.stopPropagation(); prevMonth(); }} 
          className="p-2 hover:bg-primary/10 rounded-full transition-colors"
          disabled={viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear()}
        >
          <Minus size={18} className="text-foreground/60" />
        </button>
        <span className="font-bold text-sm tracking-tight text-foreground">{monthName} {year}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); nextMonth(); }} 
          className="p-2 hover:bg-primary/10 rounded-full transition-colors"
        >
          <Plus size={18} className="text-foreground/60" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] uppercase font-bold text-muted-foreground/60 text-center py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth(viewDate) }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth(viewDate) }).map((_, i) => {
          const day = i + 1;
          const checkInActive = isCheckIn(day);
          const checkOutActive = isCheckOut(day);
          const range = isInRange(day);
          const past = isPast(day);
          
          return (
            <button
              key={day}
              disabled={past}
              onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
              className={`h-9 w-9 text-xs transition-all flex items-center justify-center relative
                ${(checkInActive || checkOutActive) ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 z-10' : ''}
                ${checkInActive && hasRange ? 'rounded-l-full' : ''}
                ${checkOutActive ? 'rounded-r-full' : ''}
                ${(!hasRange && (checkInActive || checkOutActive)) ? 'rounded-full' : ''}
                ${range ? 'bg-primary/10 text-primary rounded-none' : ''}
                ${!checkInActive && !checkOutActive && !range ? 'hover:bg-primary/5 text-foreground rounded-full' : ''}
                ${past ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;
