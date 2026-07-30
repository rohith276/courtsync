"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getCourts() {
  return await prisma.court.findMany({
    orderBy: { name: "asc" }
  })
}

export async function getBookingsForDate(dateStr: string) {
  // dateStr is YYYY-MM-DD
  const startOfDay = new Date(`${dateStr}T00:00:00Z`)
  const endOfDay = new Date(`${dateStr}T23:59:59Z`)
  
  return await prisma.booking.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay
      },
      status: {
        not: "CANCELLED"
      }
    }
  })
}

export async function createBooking(data: {
  courtId: string,
  dateStr: string,
  startTime: string,
  endTime: string,
  totalAmount: number,
  hours: number,
  equipment?: { equipmentId: string; quantity: number; price: number }[],
}) {
  try {
    // In a real app we'd get this from the auth context
    const user = await prisma.user.findFirst()
    if (!user) throw new Error("User not found")

    const bookingDate = new Date(`${data.dateStr}T12:00:00Z`) // Store date safely
    const startHour = parseInt(data.startTime.split(":")[0])
    const endHour = parseInt(data.endTime.split(":")[0])

    // Check for double booking across all hours in the range
    for (let h = startHour; h < endHour; h++) {
      const hourStr = `${h.toString().padStart(2, "0")}:00`
      const existing = await prisma.booking.findFirst({
        where: {
          courtId: data.courtId,
          date: {
            gte: new Date(`${data.dateStr}T00:00:00Z`),
            lte: new Date(`${data.dateStr}T23:59:59Z`)
          },
          startTime: hourStr,
          status: { not: "CANCELLED" }
        }
      })
      if (existing) {
        return { success: false, error: `Slot ${hourStr} was just booked by someone else.` }
      }
    }

    // Create individual bookings for each hour in the range
    // (This maintains compatibility with the 1-hour-per-booking model)
    const bookingIds: string[] = []
    
    for (let h = startHour; h < endHour; h++) {
      const hourStr = `${h.toString().padStart(2, "0")}:00`
      const nextHourStr = `${(h + 1).toString().padStart(2, "0")}:00`

      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          courtId: data.courtId,
          date: bookingDate,
          startTime: hourStr,
          endTime: nextHourStr,
          totalAmount: data.totalAmount / data.hours, // per-hour share
          status: "CONFIRMED"
        }
      })
      bookingIds.push(booking.id)

      // Attach equipment to the first booking only
      if (h === startHour && data.equipment && data.equipment.length > 0) {
        for (const eq of data.equipment) {
          await prisma.bookingEquipment.create({
            data: {
              bookingId: booking.id,
              equipmentId: eq.equipmentId,
              quantity: eq.quantity,
              price: eq.price,
            }
          })
        }
      }
    }

    revalidatePath("/booking")
    return { success: true, bookingId: bookingIds[0], totalBookings: bookingIds.length }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
