"use server"

import prisma from "@/lib/prisma"
import { addMonths } from "date-fns"

export async function createMembership(email: string, tierName: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new Error("User not found")

    // Find or create tier for mock purposes if it doesn't exist
    let tier = await prisma.membershipTier.findFirst({ where: { name: tierName } })
    if (!tier) {
      tier = await prisma.membershipTier.create({
        data: {
          name: tierName,
          priceMonthly: tierName === "Elite" ? 4999 : 1999,
          discountPct: tierName === "Elite" ? 25 : 15,
        }
      })
    }

    const startDate = new Date()
    const endDate = addMonths(startDate, 1)

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        tierId: tier.id,
        startDate,
        endDate,
        status: "ACTIVE"
      }
    })

    return { success: true, membershipId: membership.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
