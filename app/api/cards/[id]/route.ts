import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    // Fetch a single card by ID, including its author
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true, // Include only necessary fields for the author
          },
        },
      },
    });

    if (!card) {
      return new Response(JSON.stringify({ error: "Card not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(card), { status: 200 });
  } catch (error) {
    console.error("GET Card Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch card" }), {
      status: 500,
    });
  }
}



export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { content, positionX, positionY } = await req.json();

    if (!content || positionX === undefined || positionY === undefined) {
      return new Response(
        JSON.stringify({
          error: "All fields (content, positionX, positionY) are required",
        }),
        { status: 400 }
      );
    }

    // Check if the card exists
    const existingCard = await prisma.card.findUnique({
      where: { id: params.id },
    });

    if (!existingCard) {
      return new Response(JSON.stringify({ error: "Card not found" }), {
        status: 404,
      });
    }

    // Update the card
    const updatedCard = await prisma.card.update({
      where: { id: params.id },
      data: {
        content,
        positionX,
        positionY,
      },
    });

    return new Response(JSON.stringify(updatedCard), { status: 200 });
  } catch (error) {
    console.error("PUT Card Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update card" }), {
      status: 500,
    });
  }
}
