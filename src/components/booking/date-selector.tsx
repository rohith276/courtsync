"use client"

import { format, addDays, isSameDay } from "date-fns"
import { motion } from "framer-motion"

interface DateSelectorProps {
  selectedDate: Date
  onSelect: (date: Date) => void
}

export function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
  // Generate next 7 days
  const days = Array.from({ length: 7 }).map((_, i) => addDays(new Date(), i))

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      {days.map((date) => {
        const isSelected = isSameDay(date, selectedDate)
        
        return (
          <button
            key={date.toISOString()}
            onClick={() => onSelect(date)}
            className={`flex-shrink-0 w-16 h-20 rounded-lg border transition-all relative flex flex-col items-center justify-center ${
              isSelected 
                ? "border-primary bg-primary/5 text-primary" 
                : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="activeDate"
                className="absolute inset-0 bg-primary/10 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="text-xs uppercase tracking-widest font-semibold mb-1 z-10">
              {format(date, "EEE")}
            </span>
            <span className="text-xl font-bold font-heading z-10">
              {format(date, "d")}
            </span>
          </button>
        )
      })}
    </div>
  )
}
