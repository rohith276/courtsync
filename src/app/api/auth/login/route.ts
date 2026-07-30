import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get("email")

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  try {
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Auto-create test user if they somehow try a different email for the mock flow
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          role: "USER",
          rewardPoints: 50,
        }
      })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
