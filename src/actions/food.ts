"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ─── Menu Queries ───

export async function getMenuItems(category?: string) {
  return await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
      ...(category && category !== "ALL" ? { category } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  })
}

export async function getMenuCategories() {
  const items = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    select: { category: true },
    distinct: ["category"],
  })
  return items.map((i) => i.category)
}

export async function getRecommendedItems() {
  // Return top-rated items as recommendations
  return await prisma.menuItem.findMany({
    where: { isAvailable: true, ratingCount: { gte: 200 } },
    orderBy: [{ rating: "desc" }, { ratingCount: "desc" }],
    take: 8,
  })
}

// ─── Coupon System ───

export async function getAvailableCoupons() {
  return await prisma.coupon.findMany({
    where: {
      isActive: true,
      validUntil: { gte: new Date() },
      validFrom: { lte: new Date() },
    },
    orderBy: { discountValue: "desc" },
  })
}

export async function applyCoupon(code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({ where: { code } })

  if (!coupon) {
    return { success: false, error: "Invalid coupon code" }
  }
  if (!coupon.isActive) {
    return { success: false, error: "This coupon is no longer active" }
  }
  if (new Date() > coupon.validUntil) {
    return { success: false, error: "This coupon has expired" }
  }
  if (coupon.usedCount >= coupon.usageLimit) {
    return { success: false, error: "This coupon has reached its usage limit" }
  }
  if (subtotal < coupon.minOrderValue) {
    return {
      success: false,
      error: `Minimum order of ₹${coupon.minOrderValue} required`,
    }
  }

  let discount = 0
  if (coupon.discountType === "PERCENTAGE") {
    discount = (subtotal * coupon.discountValue) / 100
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount
    }
  } else {
    discount = coupon.discountValue
  }

  return {
    success: true,
    discount: Math.round(discount * 100) / 100,
    coupon: {
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
  }
}

// ─── Rewards ───

export async function getRewardPoints() {
  const user = await prisma.user.findFirst()
  return user?.rewardPoints ?? 0
}

// ─── Order Placement ───

export async function createFoodOrder(data: {
  items: { menuItemId: string; quantity: number; price: number }[]
  deliveryType: string
  couponCode?: string
  rewardPointsUsed?: number
  deliveryAddress?: string
  specialInstructions?: string
}) {
  try {
    const user = await prisma.user.findFirst()
    if (!user) throw new Error("User not found")

    const subtotal = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Apply coupon if provided
    let discount = 0
    if (data.couponCode) {
      const couponResult = await applyCoupon(data.couponCode, subtotal)
      if (couponResult.success) {
        discount = couponResult.discount!
        // Increment coupon usage
        await prisma.coupon.update({
          where: { code: data.couponCode },
          data: { usedCount: { increment: 1 } },
        })
      }
    }

    // Apply reward points (1 point = ₹0.25)
    let rewardDiscount = 0
    const pointsToUse = data.rewardPointsUsed ?? 0
    if (pointsToUse > 0 && pointsToUse <= user.rewardPoints) {
      rewardDiscount = pointsToUse * 0.25
    }

    const totalAmount = Math.max(0, subtotal - discount - rewardDiscount)

    // Earn reward points: 10 points per ₹100 spent
    const pointsEarned = Math.floor((totalAmount / 100) * 10)

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        deliveryType: data.deliveryType,
        totalAmount,
        couponCode: data.couponCode || null,
        discount,
        rewardPointsUsed: pointsToUse,
        rewardPointsEarned: pointsEarned,
        deliveryAddress: data.deliveryAddress || null,
        specialInstructions: data.specialInstructions || null,
        status: "RECEIVED",
        orderItems: {
          create: data.items.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Update user reward points
    const netPoints = pointsEarned - pointsToUse
    await prisma.user.update({
      where: { id: user.id },
      data: { rewardPoints: { increment: netPoints } },
    })

    // Log reward transactions
    if (pointsToUse > 0) {
      await prisma.rewardTransaction.create({
        data: {
          userId: user.id,
          points: -pointsToUse,
          type: "REDEEMED",
          description: `Redeemed for order #${order.id.slice(0, 8)}`,
          orderId: order.id,
        },
      })
    }
    if (pointsEarned > 0) {
      await prisma.rewardTransaction.create({
        data: {
          userId: user.id,
          points: pointsEarned,
          type: "EARNED",
          description: `Earned from order #${order.id.slice(0, 8)}`,
          orderId: order.id,
        },
      })
    }

    revalidatePath("/food")

    return {
      success: true,
      orderId: order.id,
      totalAmount,
      discount,
      pointsEarned,
      pointsUsed: pointsToUse,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
