import prisma from "../lib/prisma";

async function main() {
  console.log("Seeding initial data...");

  // Create example countries
  const countries = [
    { name: "United States", code: "US" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }

  const usCountry = await prisma.country.findUnique({ where: { code: "US" } });
  const frCountry = await prisma.country.findUnique({ where: { code: "FR" } });

  // Create example users
  const user1 = await prisma.user.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "john.doe@example.com",
      countryId: usCountry?.id,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane.smith@example.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      countryId: frCountry?.id,
    },
  });

  // Create example categories
  const categories = ["Technology", "Finance", "Healthcare"];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });
  }

  const techCategory = await prisma.category.findUnique({
    where: { name: "Technology" },
  });

  const financeCategory = await prisma.category.findUnique({
    where: { name: "Finance" },
  });

  // Add example cards with position
  await prisma.card.createMany({
    data: [
      {
        content: "Exploring the future of AI",
        creatorId: user1.id,
        countryId: usCountry?.id,
        categoryId: techCategory?.id,
        likes: 10,
        reports: 0,
        positionX: 100, // Card position on the X-axis
        positionY: 200, // Card position on the Y-axis
      },
      {
        content: "Understanding blockchain in finance",
        creatorId: user2.id,
        countryId: frCountry?.id,
        categoryId: financeCategory?.id,
        likes: 8,
        reports: 1,
        positionX: 300,
        positionY: 150,
      },
      {
        content: "Breakthroughs in modern medicine",
        creatorId: user1.id,
        countryId: usCountry?.id,
        categoryId: techCategory?.id,
        likes: 15,
        reports: 0,
        positionX: 500,
        positionY: 100,
      },
    ],
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
