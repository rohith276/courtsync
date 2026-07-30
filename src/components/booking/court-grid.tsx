"use client"

import { Button } from "@/components/ui/button"

interface Court {
  id: string
  name: string
  hourlyRate: number
}

interface Booking {
  id: string
  courtId: string
  startTime: string
  endTime: string
}

interface CourtGridProps {
  courts: Court[]
  bookings: Booking[]
  onSelectSlot: (courtId: string, startTime: string, endTime: string, rate: number) => void
  selectedSlot: { courtId: string, startTime: string } | null
}

const HOURS = Array.from({ length: 18 }).map((_, i) => i + 6) // 6 AM to 11 PM

export function CourtGrid({ courts, bookings, onSelectSlot, selectedSlot }: CourtGridProps) {
  
  const isBooked = (courtId: string, startHour: number) => {
    const formattedHour = `${startHour.toString().padStart(2, '0')}:00`
    return bookings.some(b => b.courtId === courtId && b.startTime === formattedHour)
  }

  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg bg-card">
      <div className="min-w-[800px]">
        {/* Header Row */}
        <div className="flex border-b border-border bg-muted/50">
          <div className="w-24 shrink-0 p-3 border-r border-border font-semibold text-xs uppercase tracking-widest text-muted-foreground flex items-center justify-center">
            Time
          </div>
          {courts.map(court => (
            <div key={court.id} className="flex-1 p-3 text-center border-r border-border last:border-0 font-semibold text-sm">
              {court.name}
            </div>
          ))}
        </div>

        {/* Time Rows */}
        <div className="flex flex-col">
          {HOURS.map(hour => {
            const timeLabel = `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`
            const startTimeStr = `${hour.toString().padStart(2, '0')}:00`
            const endTimeStr = `${(hour + 1).toString().padStart(2, '0')}:00`

            return (
              <div key={hour} className="flex border-b border-border last:border-0 group hover:bg-muted/30">
                <div className="w-24 shrink-0 p-3 border-r border-border text-xs font-mono text-muted-foreground flex items-center justify-center">
                  {timeLabel}
                </div>
                
                {courts.map(court => {
                  const booked = isBooked(court.id, hour)
                  const selected = selectedSlot?.courtId === court.id && selectedSlot?.startTime === startTimeStr

                  return (
                    <div key={`${court.id}-${hour}`} className="flex-1 border-r border-border last:border-0 p-1">
                      {booked ? (
                        <div className="w-full h-full min-h-[48px] bg-muted flex items-center justify-center rounded-sm cursor-not-allowed">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booked</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSelectSlot(court.id, startTimeStr, endTimeStr, court.hourlyRate)}
                          className={`w-full h-full min-h-[48px] flex items-center justify-center rounded-sm transition-all border ${
                            selected 
                              ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                              : "bg-transparent border-transparent hover:border-primary/30 hover:bg-primary/5 text-transparent hover:text-primary"
                          }`}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            {selected ? "Selected" : "Available"}
                          </span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
