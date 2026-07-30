"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MapPin } from "lucide-react"

interface Court {
  id: string
  name: string
  type: string
  hourlyRate: number
}

interface Booking {
  id: string
  courtId: string
  startTime: string
  endTime: string
}

interface SelectedSlot {
  courtId: string
  startTime: string
  endTime: string
  rate: number
  hours: number
}

interface CourtListProps {
  courts: Court[]
  bookings: Booking[]
  onSelectSlot: (slot: SelectedSlot) => void
  selectedSlot: SelectedSlot | null
  sportFilter: string
}

const HOURS = Array.from({ length: 18 }).map((_, i) => i + 6) // 6 AM to 11 PM

function formatHour(hour: number) {
  if (hour === 0 || hour === 24) return "12 AM"
  if (hour === 12) return "12 PM"
  return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
}

function getSportLabel(type: string) {
  if (type === "CRICKET_PITCH") return "Cricket"
  return "Badminton"
}

function getSportBg(type: string) {
  if (type === "CRICKET_PITCH") return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
  if (type === "SYNTHETIC") return "bg-blue-500/10 text-blue-600 border-blue-500/30"
  return "bg-lime-500/10 text-lime-700 dark:text-lime-500 border-lime-500/30"
}

export function CourtList({ courts, bookings, onSelectSlot, selectedSlot, sportFilter }: CourtListProps) {
  const [expandedCourt, setExpandedCourt] = useState<string | null>(null)
  // Range selection state: when user taps a start, we store it, then on second tap we set the range
  const [rangeStart, setRangeStart] = useState<{ courtId: string; hour: number } | null>(null)

  const filteredCourts = courts.filter(c => {
    if (sportFilter === "ALL") return true
    if (sportFilter === "BADMINTON") return c.type !== "CRICKET_PITCH"
    if (sportFilter === "CRICKET") return c.type === "CRICKET_PITCH"
    return true
  })

  const isBooked = (courtId: string, hour: number) => {
    const h = `${hour.toString().padStart(2, "0")}:00`
    return bookings.some(b => b.courtId === courtId && b.startTime === h)
  }

  const isInSelectedRange = (courtId: string, hour: number) => {
    if (!selectedSlot || selectedSlot.courtId !== courtId) return false
    const start = parseInt(selectedSlot.startTime.split(":")[0])
    const end = parseInt(selectedSlot.endTime.split(":")[0])
    return hour >= start && hour < end
  }

  const isRangeStartHour = (courtId: string, hour: number) => {
    return rangeStart?.courtId === courtId && rangeStart.hour === hour
  }

  const handleSlotTap = (court: Court, hour: number) => {
    if (isBooked(court.id, hour)) return

    if (!rangeStart || rangeStart.courtId !== court.id) {
      // Start a new range on this court
      setRangeStart({ courtId: court.id, hour })
      // Also immediately select as a 1-hour booking for preview
      onSelectSlot({
        courtId: court.id,
        startTime: `${hour.toString().padStart(2, "0")}:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        rate: court.hourlyRate,
        hours: 1,
      })
    } else {
      // Second tap on same court — finalize range
      const startHour = Math.min(rangeStart.hour, hour)
      const endHour = Math.max(rangeStart.hour, hour) + 1 // inclusive of the tapped slot

      // Check all hours in range are available
      let allAvailable = true
      for (let h = startHour; h < endHour; h++) {
        if (isBooked(court.id, h)) {
          allAvailable = false
          break
        }
      }

      if (!allAvailable) {
        // Reset if range has booked slots
        setRangeStart({ courtId: court.id, hour })
        onSelectSlot({
          courtId: court.id,
          startTime: `${hour.toString().padStart(2, "0")}:00`,
          endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
          rate: court.hourlyRate,
          hours: 1,
        })
        return
      }

      const totalHours = endHour - startHour
      onSelectSlot({
        courtId: court.id,
        startTime: `${startHour.toString().padStart(2, "0")}:00`,
        endTime: `${endHour.toString().padStart(2, "0")}:00`,
        rate: court.hourlyRate * totalHours,
        hours: totalHours,
      })
      setRangeStart(null)
    }
  }

  const toggleCourt = (courtId: string) => {
    setExpandedCourt(expandedCourt === courtId ? null : courtId)
    setRangeStart(null)
  }

  return (
    <div className="space-y-4">
      {filteredCourts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No courts available for this sport type.
        </div>
      )}

      {filteredCourts.map((court) => {
        const isExpanded = expandedCourt === court.id
        const bookedCount = HOURS.filter(h => isBooked(court.id, h)).length
        const availableCount = HOURS.length - bookedCount

        return (
          <div
            key={court.id}
            className="border border-border bg-card overflow-hidden transition-all"
          >
            {/* Court Header — always visible */}
            <button
              onClick={() => toggleCourt(court.id)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{court.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${getSportBg(court.type)}`}>
                      {getSportLabel(court.type)}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">₹{court.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-semibold text-green-600">{availableCount} slots</span>
                  <span className="text-xs text-muted-foreground"> available</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </button>

            {/* Expanded — Time Chips */}
            {isExpanded && (
              <div className="border-t border-border p-4 md:p-5 bg-background">
                <p className="text-xs text-muted-foreground mb-3">
                  {rangeStart && rangeStart.courtId === court.id
                    ? "Tap a second slot to select a time range, or tap the same slot for 1 hour."
                    : "Tap a slot to start. Tap a second slot for continuous hours."}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {HOURS.map((hour) => {
                    const booked = isBooked(court.id, hour)
                    const inRange = isInSelectedRange(court.id, hour)
                    const isStart = isRangeStartHour(court.id, hour)

                    return (
                      <button
                        key={hour}
                        disabled={booked}
                        onClick={() => handleSlotTap(court, hour)}
                        className={`
                          relative py-3 px-2 text-center text-sm font-mono font-medium transition-all border
                          ${booked
                            ? "bg-muted border-border text-muted-foreground/40 cursor-not-allowed line-through"
                            : inRange
                              ? "bg-primary text-primary-foreground border-primary shadow-sm"
                              : isStart
                                ? "bg-primary/20 border-primary text-primary ring-2 ring-primary/30"
                                : "bg-card border-border hover:border-foreground/40 hover:bg-muted/50 cursor-pointer"
                          }
                        `}
                      >
                        {formatHour(hour)}
                        {booked && (
                          <span className="block text-[9px] uppercase tracking-wider mt-0.5 no-underline" style={{ textDecoration: 'none' }}>Booked</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
