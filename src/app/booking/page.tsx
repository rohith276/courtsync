import { getCourts, getBookingsForDate } from "@/actions/booking"
import { BookingClient } from "./client"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"

export default async function BookingPage() {
  const courts = await getCourts()
  const todayStr = new Date().toISOString().split("T")[0]
  const initialBookings = await getBookingsForDate(todayStr)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-muted/30 pt-24 pb-28 xl:pb-12">
        <BookingClient courts={courts} initialBookings={initialBookings} />
      </main>
      <Footer />
    </div>
  )
}
