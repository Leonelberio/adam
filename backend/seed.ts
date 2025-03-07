import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Example organizations
  const organizations = [
    { id: 1, name: "Test Organization A" },
    { id: 2, name: "Tech Innovators" },
    { id: 3, name: "Event Masters" },
    { id: 4, name: "Knowledge Builders" },
    { id: 5, name: "OpenAPI Developers" },
  ];

  // Generating agents for each organization
  for (const org of organizations) {
    await prisma.agent.create({
      data: {
        name: `Agent for ${org.name}`,
        description: `Handles operations for ${org.name}`,
        apiKey: generateApiKey(),
        model: "GPT-4",
        organization: {
          connect: { id: org.id }, // Connect to the existing organization
        },
      },
    });
  }

  console.log("Agents created successfully!");
}

function generateApiKey() {
  // Simple function to generate unique API keys
  return `${crypto.randomUUID()}`;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
