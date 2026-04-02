import React from 'react';
import { Minus, Plus } from "lucide-react";

const BookingCounter = ({ label, value, onMinus, onPlus }) => (
  <div className="flex items-center justify-between p-4 min-w-[200px] text-foreground">
    <span className="text-sm font-medium">{label}</span>
    <div className="flex items-center gap-4">
      <button 
        onClick={(e) => { e.stopPropagation(); onMinus(); }}
        className="p-1.5 rounded-full border border-border hover:bg-primary/5 transition-colors disabled:opacity-30 text-foreground"
        disabled={value <= (label === 'Adults' || label === 'Rooms' ? 1 : 0)}
      >
        <Minus size={14} />
      </button>
      <span className="text-sm font-bold w-4 text-center">{value}</span>
      <button 
        onClick={(e) => { e.stopPropagation(); onPlus(); }}
        className="p-1.5 rounded-full border border-border hover:bg-primary/5 transition-colors text-foreground"
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

export default BookingCounter;
