"use server"

import prisma from "@/lib/prisma"

export async function getUserDashboardData(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        bookings: {
          include: { 
            court: true, 
            payment: true,
            equipments: { include: { equipment: true } } 
          },
          orderBy: { date: 'desc' },
        },
        orders: {
          include: { orderItems: { include: { menuItem: true } } },
          orderBy: { createdAt: 'desc' },
        },
        memberships: {
          include: { tier: true },
          orderBy: { endDate: 'desc' },
        },
        rewardTxns: {
          orderBy: { createdAt: 'desc' },
        }
      }
    })

    if (!user) return { success: false, error: "User not found" }
    
    return { success: true, data: user }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
