import prisma from "../lib/prisma";

const categories = [
  { name: "Technologie" },
  { name: "Finance" },
  { name: "Agriculture" },
  { name: "Médecine" },
  { name: "Éducation" },
  { name: "Immobilier" },
  { name: "Transport" },
  { name: "Énergie" },
  { name: "Environnement" },
  { name: "Divertissement" },
  { name: "Tourisme" },
  { name: "Commerce" },
  { name: "Industrie" },
  { name: "Santé" },
  { name: "E-commerce" },
];

async function main() {
  console.log("Seeding categories...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: { name: category.name },
    });
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
