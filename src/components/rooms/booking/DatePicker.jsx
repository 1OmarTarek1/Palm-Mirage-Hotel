import React, { useState } from 'react';
import { Minus, Plus, ShoppingBasket } from "lucide-react";

const DatePicker = ({ checkIn, checkOut, setBookingState, setActivePopover, bookedRanges = [], onBlockedDateClick, onInvalidRangeSelection }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(new Date(checkIn || today));

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const selectingCheckout = Boolean(checkIn && !checkOut);

  const addDays = (date, amount) => {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    if (selectedDate < today) return;
    if (!selectingCheckout && isUnavailableCheckInDate(selectedDate)) {
      onBlockedDateClick?.(selectedDate);
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setBookingState(prev => ({ ...prev, checkIn: selectedDate, checkOut: null }));
    } else if (selectedDate > checkIn) {
      if (isUnavailableCheckoutDate(selectedDate)) {
        onInvalidRangeSelection?.(checkIn, selectedDate);
        return;
      }
      setBookingState(prev => ({ ...prev, checkOut: selectedDate }));
      setActivePopover(null); 
    } else if (selectedDate.toDateString() === checkIn.toDateString()) {
      const nextDay = addDays(selectedDate, 1);

      if (isUnavailableCheckoutDate(selectedDate)) {
        onInvalidRangeSelection?.(selectedDate, nextDay);
        return;
      }

      setBookingState(prev => ({ ...prev, checkOut: nextDay }));
      setActivePopover(null);
    } else {
      if (isUnavailableCheckInDate(selectedDate)) {
        onBlockedDateClick?.(selectedDate);
        return;
      }
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

  const isBooked = (date) => {
    const current = new Date(date);
    current.setHours(0, 0, 0, 0);

    return bookedRanges.some((range) => {
      const start = new Date(range.checkInDate);
      const end = new Date(range.checkOutDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return current >= start && current < end;
    });
  };

  const isUnavailableCheckInDate = (date) => {
    if (isBooked(date)) return true;
    return isBooked(addDays(date, 1));
  };

  const rangeIncludesBookedDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    return bookedRanges.some((range) => {
      const bookedStart = new Date(range.checkInDate);
      const bookedEnd = new Date(range.checkOutDate);
      bookedStart.setHours(0, 0, 0, 0);
      bookedEnd.setHours(0, 0, 0, 0);
      return bookedStart < end && bookedEnd > start;
    });
  };

  const isUnavailableCheckoutDate = (date) => {
    if (!checkIn) return false;

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);

    const start = new Date(checkIn);
    start.setHours(0, 0, 0, 0);

    if (selected.toDateString() === start.toDateString()) {
      return isBooked(addDays(selected, 1));
    }

    if (selected <= start) {
      return true;
    }

    return rangeIncludesBookedDays(start, selected);
  };

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const year = viewDate.getFullYear();
  const hasRange = checkIn && checkOut;
  const hasSelection = Boolean(checkIn || checkOut);

  return (
    <div className="relative w-full p-4">
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
      <div className="grid grid-cols-7 place-items-center gap-1">
        {Array.from({ length: firstDayOfMonth(viewDate) }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth(viewDate) }).map((_, i) => {
          const day = i + 1;
          const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const checkInActive = isCheckIn(day);
          const checkOutActive = isCheckOut(day);
          const range = isInRange(day);
          const past = isPast(day);
          const booked = isBooked(currentDate);
          const unavailableCheckIn = !selectingCheckout && !booked && isUnavailableCheckInDate(currentDate);
          const unavailableCheckout = selectingCheckout && !booked && isUnavailableCheckoutDate(currentDate);
          const visuallyBlocked = unavailableCheckIn || unavailableCheckout;
          const disabled = past || booked || visuallyBlocked;
          
          return (
            <button
              key={day}
               disabled={disabled}
              onClick={(e) => { e.stopPropagation(); handleDateClick(day); }}
              className={`h-9 w-9 text-xs transition-all flex items-center justify-center relative
                ${(checkInActive || checkOutActive) ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 z-10' : ''}
                ${checkInActive && hasRange ? 'rounded-l-full' : ''}
                ${checkOutActive ? 'rounded-r-full' : ''}
                ${(!hasRange && (checkInActive || checkOutActive)) ? 'rounded-full' : ''}
                ${range ? 'bg-primary/10 text-primary rounded-none' : ''}
                ${booked ? 'bg-destructive/12 text-destructive rounded-full' : ''}
                ${visuallyBlocked ? 'rounded-full border border-primary/20 bg-primary/6 text-muted-foreground' : ''}
                ${!checkInActive && !checkOutActive && !range ? 'hover:bg-primary/5 text-foreground rounded-full' : ''}
                ${(past || booked || visuallyBlocked) ? 'cursor-not-allowed' : 'cursor-pointer'}
                ${past ? 'opacity-20' : ''}
              `}
            >
              {day}
              {booked && !checkInActive && !checkOutActive ? <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-destructive" /> : null}
              {visuallyBlocked && !booked && !checkInActive && !checkOutActive ? <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" /> : null}
            </button>
          );
        })}
      </div>
      <div className="absolute right-4 bottom-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setBookingState((prev) => ({ ...prev, checkIn: null, checkOut: null }));
          }}
          disabled={!hasSelection}
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Clear selected dates"
          title="Clear selected dates"
        >
          <ShoppingBasket size={16} />
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
