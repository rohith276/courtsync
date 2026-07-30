import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Courts ───
  const courts = [
    { name: 'Court 1 — Alpha', type: 'INDOOR_WOODEN', hourlyRate: 400 },
    { name: 'Court 2 — Bravo', type: 'INDOOR_WOODEN', hourlyRate: 400 },
    { name: 'Court 3 — Charlie', type: 'INDOOR_WOODEN', hourlyRate: 400 },
    { name: 'Court 4 — Delta', type: 'INDOOR_WOODEN', hourlyRate: 400 },
    { name: 'Court 5 — Echo', type: 'SYNTHETIC', hourlyRate: 500 },
    { name: 'Court 6 — Foxtrot', type: 'SYNTHETIC', hourlyRate: 500 },
    { name: 'Court 7 — Golf', type: 'SYNTHETIC', hourlyRate: 500 },
    { name: 'Court 8 — Premium', type: 'SYNTHETIC', hourlyRate: 600 },
    { name: 'Pitch 1 — Grass', type: 'CRICKET_PITCH', hourlyRate: 800 },
    { name: 'Pitch 2 — Astro', type: 'CRICKET_PITCH', hourlyRate: 1000 },
  ]

  for (const court of courts) {
    const existing = await prisma.court.findFirst({ where: { name: court.name } })
    if (!existing) {
      await prisma.court.create({ data: court })
    }
  }
  console.log(`✅ Created ${courts.length} courts`)

  // ─── Test User ───
  let user = await prisma.user.findFirst({ where: { email: 'test@example.com' } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'John Doe',
        phone: '9876543210',
        role: 'USER',
        rewardPoints: 120,
      }
    })
  }
  console.log(`✅ Created user: ${user.email}`)

  // ─── Equipment Rentals ───
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
    }
  }
  console.log(`✅ Created ${equipments.length} equipment items`)

  // ─── Menu Items ───
  const menuItems = [
    // STARTERS
    { name: 'Peri Peri Paneer Bites', description: 'Crispy paneer cubes tossed in house peri peri sauce with mint chutney', price: 249, category: 'STARTERS', isVeg: true, isSpicy: true, preparationTime: 12, rating: 4.5, ratingCount: 342, sortOrder: 1 },
    { name: 'Smoky Chicken Wings', description: 'Charcoal-grilled wings with chipotle glaze, served with ranch dip', price: 349, category: 'STARTERS', isVeg: false, isSpicy: true, preparationTime: 18, rating: 4.7, ratingCount: 521, sortOrder: 2 },
    { name: 'Classic Spring Rolls', description: 'Crispy vegetable spring rolls with sweet chili sauce', price: 199, category: 'STARTERS', isVeg: true, isSpicy: false, preparationTime: 10, rating: 4.2, ratingCount: 189, sortOrder: 3 },
    { name: 'Loaded Nachos Supreme', description: 'Tortilla chips with melted cheese, jalapeños, salsa, sour cream & guacamole', price: 329, category: 'STARTERS', isVeg: true, isSpicy: true, preparationTime: 10, rating: 4.6, ratingCount: 456, sortOrder: 4 },
    { name: 'Tandoori Chicken Tikka', description: 'Clay oven-roasted chicken marinated overnight in yogurt and spices', price: 379, category: 'STARTERS', isVeg: false, isSpicy: false, preparationTime: 20, rating: 4.8, ratingCount: 678, sortOrder: 5 },

    // MAINS
    { name: 'Butter Chicken with Naan', description: 'Signature creamy tomato curry with tender chicken and fresh butter naan', price: 449, category: 'MAINS', isVeg: false, isSpicy: false, preparationTime: 25, rating: 4.9, ratingCount: 1203, sortOrder: 1 },
    { name: 'Hyderabadi Chicken Biryani', description: 'Dum-cooked basmati rice layered with spiced chicken, raita on the side', price: 399, category: 'MAINS', isVeg: false, isSpicy: true, preparationTime: 30, rating: 4.8, ratingCount: 987, sortOrder: 2 },
    { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in rich onion-tomato gravy with jeera rice', price: 349, category: 'MAINS', isVeg: true, isSpicy: false, preparationTime: 22, rating: 4.5, ratingCount: 534, sortOrder: 3 },
    { name: 'Wood-Fired Margherita Pizza', description: 'San Marzano tomatoes, fresh mozzarella, basil on sourdough crust', price: 449, category: 'MAINS', isVeg: true, isSpicy: false, preparationTime: 15, rating: 4.6, ratingCount: 723, sortOrder: 4 },
    { name: 'Truffle Mushroom Pasta', description: 'Penne in creamy truffle sauce with sautéed wild mushrooms and parmesan', price: 389, category: 'MAINS', isVeg: true, isSpicy: false, preparationTime: 18, rating: 4.4, ratingCount: 312, sortOrder: 5 },
    { name: 'Grilled Chicken Steak', description: '200g chicken breast, herb-crusted, with mashed potatoes and grilled veggies', price: 499, category: 'MAINS', isVeg: false, isSpicy: false, preparationTime: 25, rating: 4.7, ratingCount: 445, sortOrder: 6 },

    // BOWLS
    { name: 'Protein Power Bowl', description: 'Grilled chicken, quinoa, avocado, edamame, boiled eggs & sesame dressing', price: 429, category: 'BOWLS', isVeg: false, isSpicy: false, preparationTime: 12, rating: 4.6, ratingCount: 389, sortOrder: 1 },
    { name: 'Buddha Bowl', description: 'Roasted sweet potato, chickpeas, kale, tahini dressing & pickled onions', price: 379, category: 'BOWLS', isVeg: true, isSpicy: false, preparationTime: 12, rating: 4.3, ratingCount: 267, sortOrder: 2 },
    { name: 'Spicy Tuna Poke Bowl', description: 'Sushi rice, marinated tuna, cucumber, avocado, sriracha mayo & nori', price: 499, category: 'BOWLS', isVeg: false, isSpicy: true, preparationTime: 10, rating: 4.5, ratingCount: 198, sortOrder: 3 },
    { name: 'Teriyaki Tofu Bowl', description: 'Glazed tofu, jasmine rice, stir-fried vegetables & pickled ginger', price: 349, category: 'BOWLS', isVeg: true, isSpicy: false, preparationTime: 15, rating: 4.2, ratingCount: 156, sortOrder: 4 },

    // BEVERAGES
    { name: 'Cold Brew Coffee', description: 'Slow-steeped 18-hour cold brew, served over ice with optional oat milk', price: 179, category: 'BEVERAGES', isVeg: true, isSpicy: false, preparationTime: 3, rating: 4.7, ratingCount: 890, sortOrder: 1 },
    { name: 'Fresh Watermelon Juice', description: 'Chilled watermelon juice with a hint of mint and lime', price: 149, category: 'BEVERAGES', isVeg: true, isSpicy: false, preparationTime: 5, rating: 4.4, ratingCount: 567, sortOrder: 2 },
    { name: 'Mango Protein Shake', description: 'Alphonso mango blended with whey protein, banana & almond milk', price: 249, category: 'BEVERAGES', isVeg: true, isSpicy: false, preparationTime: 5, rating: 4.6, ratingCount: 423, sortOrder: 3 },
    { name: 'Electrolyte Energy Drink', description: 'Coconut water, lemon, pink salt & honey — perfect post-game recovery', price: 129, category: 'BEVERAGES', isVeg: true, isSpicy: false, preparationTime: 3, rating: 4.3, ratingCount: 345, sortOrder: 4 },
    { name: 'Iced Matcha Latte', description: 'Ceremonial grade matcha whisked with oat milk and served over ice', price: 219, category: 'BEVERAGES', isVeg: true, isSpicy: false, preparationTime: 4, rating: 4.5, ratingCount: 278, sortOrder: 5 },

    // DESSERTS
    { name: 'Molten Chocolate Lava Cake', description: 'Warm dark chocolate cake with a gooey center, served with vanilla ice cream', price: 299, category: 'DESSERTS', isVeg: true, isSpicy: false, preparationTime: 12, rating: 4.8, ratingCount: 654, sortOrder: 1 },
    { name: 'New York Cheesecake', description: 'Classic creamy cheesecake with graham cracker crust and berry compote', price: 279, category: 'DESSERTS', isVeg: true, isSpicy: false, preparationTime: 5, rating: 4.6, ratingCount: 412, sortOrder: 2 },
    { name: 'Tiramisu', description: 'Espresso-soaked ladyfingers layered with mascarpone cream and cocoa', price: 319, category: 'DESSERTS', isVeg: true, isSpicy: false, preparationTime: 5, rating: 4.7, ratingCount: 356, sortOrder: 3 },

    // QUICK BITES
    { name: 'Truffle Parmesan Fries', description: 'Crispy fries tossed in truffle oil with grated parmesan and herbs', price: 229, category: 'QUICK_BITES', isVeg: true, isSpicy: false, preparationTime: 8, rating: 4.5, ratingCount: 789, sortOrder: 1 },
    { name: 'Chicken Club Sandwich', description: 'Triple-decker with grilled chicken, bacon, lettuce, tomato & mayo on sourdough', price: 329, category: 'QUICK_BITES', isVeg: false, isSpicy: false, preparationTime: 12, rating: 4.4, ratingCount: 345, sortOrder: 2 },
    { name: 'Veg Cheese Burger', description: 'Crispy potato patty, cheddar, lettuce, pickles & special sauce on brioche bun', price: 279, category: 'QUICK_BITES', isVeg: true, isSpicy: false, preparationTime: 12, rating: 4.3, ratingCount: 234, sortOrder: 3 },
    { name: 'Paneer Tikka Wrap', description: 'Grilled paneer with mint chutney, onions & peppers in a whole wheat wrap', price: 249, category: 'QUICK_BITES', isVeg: true, isSpicy: true, preparationTime: 10, rating: 4.4, ratingCount: 412, sortOrder: 4 },
  ]

  for (const item of menuItems) {
    const existing = await prisma.menuItem.findFirst({ where: { name: item.name } })
    if (!existing) {
      await prisma.menuItem.create({ data: item })
    }
  }
  console.log(`✅ Created ${menuItems.length} menu items`)

  // ─── Coupons ───
  const coupons = [
    {
      code: 'FIRST50',
      description: '50% off on your first order',
      discountType: 'PERCENTAGE',
      discountValue: 50,
      minOrderValue: 200,
      maxDiscount: 150,
      usageLimit: 1000,
      validUntil: new Date('2027-12-31'),
    },
    {
      code: 'PLAY10',
      description: '10% off when ordering from court',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 100,
      maxDiscount: 100,
      usageLimit: 5000,
      validUntil: new Date('2027-12-31'),
    },
    {
      code: 'WEEKEND20',
      description: '20% off on weekend orders',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minOrderValue: 300,
      maxDiscount: 200,
      usageLimit: 2000,
      validUntil: new Date('2027-12-31'),
    },
    {
      code: 'FLAT100',
      description: '₹100 off on orders above ₹500',
      discountType: 'FLAT',
      discountValue: 100,
      minOrderValue: 500,
      maxDiscount: 100,
      usageLimit: 3000,
      validUntil: new Date('2027-12-31'),
    },
    {
      code: 'NEWMEMBER',
      description: '₹200 off for new members',
      discountType: 'FLAT',
      discountValue: 200,
      minOrderValue: 600,
      maxDiscount: 200,
      usageLimit: 500,
      validUntil: new Date('2027-06-30'),
    },
  ]

  for (const coupon of coupons) {
    const existing = await prisma.coupon.findFirst({ where: { code: coupon.code } })
    if (!existing) {
      await prisma.coupon.create({ data: coupon })
    }
  }
  console.log(`✅ Created ${coupons.length} coupons`)

  // ─── Seed some reward points for test user ───
  await prisma.rewardTransaction.create({
    data: {
      userId: user.id,
      points: 120,
      type: 'BONUS',
      description: 'Welcome bonus — thanks for joining KortSync!',
    }
  })
  console.log(`✅ Seeded 120 reward points for test user`)

  console.log('\n🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
