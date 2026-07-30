"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { DateSelector } from "@/components/booking/date-selector"
import { CourtList } from "@/components/booking/court-list"
import { BookingSummary } from "@/components/booking/booking-summary"
import { EquipmentRentalModal, EquipmentSelection } from "@/components/booking/equipment-rental-modal"
import { getBookingsForDate, createBooking } from "@/actions/booking"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { PaymentModal } from "@/components/shared/payment-modal"
import { CreditCard } from "lucide-react"

interface BookingClientProps {
  courts: any[]
  initialBookings: any[]
}

interface SelectedSlot {
  courtId: string
  startTime: string
  endTime: string
  rate: number
  hours: number
}

export function BookingClient({ courts, initialBookings }: BookingClientProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [bookings, setBookings] = useState<any[]>(initialBookings)
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [equipmentSelections, setEquipmentSelections] = useState<EquipmentSelection[]>([])
  const [sportFilter, setSportFilter] = useState("ALL")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()
  const { requireAuth } = useAuth()

  useEffect(() => {
    const fetchBookings = async () => {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const data = await getBookingsForDate(dateStr)
      setBookings(data)
      setSelectedSlot(null)
      setEquipmentSelections([])
    }
    fetchBookings()
  }, [selectedDate])

  const handleSelectSlot = (slot: SelectedSlot) => {
    setSelectedSlot(slot)
    // Clear equipment when switching courts/slots
    setEquipmentSelections([])
  }

  const getCourtType = (courtId: string) => {
    return courts.find(c => c.id === courtId)?.type || "INDOOR_WOODEN"
  }

  const getSportType = (courtId: string) => {
    const type = getCourtType(courtId)
    return type === "CRICKET_PITCH" ? "CRICKET" : "BADMINTON"
  }

  const getCourtName = (id: string) => courts.find(c => c.id === id)?.name || ""

  const getRatePerHour = (id: string) => courts.find(c => c.id === id)?.hourlyRate || 0

  // Calculate total including equipment
  const equipmentTotal = equipmentSelections.reduce((acc, s) => acc + s.price * s.quantity, 0)
  const grandTotal = selectedSlot ? (selectedSlot.rate + equipmentTotal) * 1.18 : 0

  const handleConfirmClick = () => {
    if (!selectedSlot) return
    requireAuth(() => {
      setIsPaymentOpen(true)
    })
  }

  const processBooking = async (paymentMethod: string) => {
    if (!selectedSlot) return
    setIsSubmitting(true)

    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const res = await createBooking({
      courtId: selectedSlot.courtId,
      dateStr,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      totalAmount: grandTotal,
      hours: selectedSlot.hours,
      equipment: equipmentSelections.map(s => ({
        equipmentId: s.equipmentId,
        quantity: s.quantity,
        price: s.price,
      })),
    })

    if (res.success) {
      toast({
        title: "Booking Confirmed",
        description: `${selectedSlot.hours} hour(s) reserved successfully.`,
      })
      const newBookings = await getBookingsForDate(dateStr)
      setBookings(newBookings)
      setSelectedSlot(null)
      setEquipmentSelections([])
      setIsPaymentOpen(false)
      router.refresh()
    } else {
      toast({
        title: "Booking Failed",
        description: res.error || "Something went wrong.",
        variant: "destructive"
      })
    }
    setIsSubmitting(false)
  }

  const sportTabs = [
    { key: "ALL", label: "All Courts" },
    { key: "BADMINTON", label: "Badminton" },
    { key: "CRICKET", label: "Cricket" },
  ]

  return (
    <div className="container mx-auto px-4 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">Book a Court</h1>
        <p className="text-muted-foreground text-lg">Select a date, court, and time range to reserve.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Date Selector */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Select Date</h3>
            <DateSelector selectedDate={selectedDate} onSelect={setSelectedDate} />
          </div>

          {/* Sport Filter Tabs */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">Sport</h3>
            <div className="flex gap-2">
              {sportTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSportFilter(tab.key)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-widest border transition-all ${
                    sportFilter === tab.key
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent border-border text-muted-foreground hover:border-foreground/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Court List */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Select Court & Time
            </h3>
            <CourtList
              courts={courts}
              bookings={bookings}
              onSelectSlot={handleSelectSlot}
              selectedSlot={selectedSlot}
              sportFilter={sportFilter}
            />
          </div>
        </div>

        {/* Summary Panel — desktop sticky sidebar */}
        <div className="xl:col-span-1 hidden xl:block">
          {selectedSlot ? (
            <BookingSummary
              date={format(selectedDate, "EEEE, MMMM do, yyyy")}
              courtName={getCourtName(selectedSlot.courtId)}
              courtType={getCourtType(selectedSlot.courtId)}
              startTime={selectedSlot.startTime}
              endTime={selectedSlot.endTime}
              hours={selectedSlot.hours}
              ratePerHour={getRatePerHour(selectedSlot.courtId)}
              equipmentSelections={equipmentSelections}
              isSubmitting={isSubmitting}
              onConfirm={handleConfirmClick}
              onAddEquipment={() => setIsEquipmentOpen(true)}
            />
          ) : (
            <div className="bg-muted border border-border border-dashed p-8 flex flex-col items-center justify-center text-center h-64 sticky top-24">
              <p className="text-muted-foreground">
                Expand a court and tap a time slot to begin.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Tap two slots to book a continuous range.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile booking bar */}
      {selectedSlot && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-md border-t border-border">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground truncate">
                {getCourtName(selectedSlot.courtId)}
              </p>
              <p className="font-mono font-bold text-lg">
                ₹{grandTotal.toFixed(2)}
                <span className="text-xs font-sans font-normal text-muted-foreground ml-1">incl. GST</span>
              </p>
            </div>
            <button
              onClick={handleConfirmClick}
              disabled={isSubmitting}
              className="shrink-0 h-12 px-6 bg-accent text-white flex items-center justify-center text-xs font-semibold uppercase tracking-widest disabled:opacity-50"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Pay & Confirm
            </button>
          </div>
        </div>
      )}

      {/* Equipment Rental Modal */}
      {selectedSlot && (
        <EquipmentRentalModal
          open={isEquipmentOpen}
          onOpenChange={setIsEquipmentOpen}
          sportType={getSportType(selectedSlot.courtId)}
          onConfirm={setEquipmentSelections}
          initialSelections={equipmentSelections}
        />
      )}

      {/* Payment Modal */}
      {selectedSlot && (
        <PaymentModal
          open={isPaymentOpen}
          onOpenChange={setIsPaymentOpen}
          amount={grandTotal}
          onSuccess={processBooking}
          title="Complete Court Booking"
        />
      )}
    </div>
  )
}
