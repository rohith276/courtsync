import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sport = searchParams.get("sport") || "BADMINTON"

  try {
    const equipment = await prisma.equipment.findMany({
      where: {
        sportType: sport,
        isActive: true,
      },
      orderBy: { price: "asc" },
    })

    return NextResponse.json({ equipment })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
