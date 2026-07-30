const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const equipments = [
    { name: 'Premium Badminton Racket', sportType: 'BADMINTON', price: 50 },
    { name: 'Standard Badminton Racket', sportType: 'BADMINTON', price: 30 },
    { name: 'Feather Shuttlecock (Box of 3)', sportType: 'BADMINTON', price: 150 },
    { name: 'Cricket Bat (English Willow)', sportType: 'CRICKET', price: 200 },
    { name: 'Cricket Bat (Kashmir Willow)', sportType: 'CRICKET', price: 100 },
    { name: 'Leather Cricket Ball (New)', sportType: 'CRICKET', price: 150 },
    { name: 'Tennis Ball (Heavy)', sportType: 'CRICKET', price: 40 },
  ]

  for (const eq of equipments) {
    const existing = await prisma.equipment.findFirst({ where: { name: eq.name } })
    if (!existing) {
      await prisma.equipment.create({ data: eq })
      console.log('Created equipment: ' + eq.name)
    }
  }

  const courts = [
    { name: 'Pitch 1 — Grass', type: 'CRICKET_PITCH', hourlyRate: 800 },
    { name: 'Pitch 2 — Astro', type: 'CRICKET_PITCH', hourlyRate: 1000 },
  ]

  for (const c of courts) {
    const existing = await prisma.court.findFirst({ where: { name: c.name } })
    if (!existing) {
      await prisma.court.create({ data: c })
      console.log('Created court: ' + c.name)
    }
  }

  console.log('Done.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
