import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Extract query parameters
    const { search = "", category = "", country = "" } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    console.log("Query Parameters:", { search, category, country });

    // Build conditions dynamically
    const conditions: Array<{ [key: string]: any }> = [];

    if (category) {
      conditions.push({ category: { name: category } });
    }

    if (country) {
      conditions.push({ author: { country } });
    }

    if (search) {
      conditions.push({
        OR: [
          { content: { contains: search, mode: "insensitive" } },
          { author: { name: { contains: search, mode: "insensitive" } } },
        ],
      });
    }

    // Query the database
    const cards = await prisma.card.findMany({
      where: conditions.length > 0 ? { AND: conditions } : {}, // Fetch all cards if no filters
      include: {
        author: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("Query Result:", cards);

    // Return response with the fetched cards
    return new Response(JSON.stringify(cards || []), { status: 200 });
  } catch (error) {
    console.error("GET Cards Error:", error);

    // Ensure a valid error response is returned
    return new Response(
      JSON.stringify({ error: "Failed to fetch cards", details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { content, positionX, positionY, authorId, categoryId } = await req.json();

    // Validate input fields
    if (!content || positionX === undefined || positionY === undefined || !authorId || !categoryId) {
      return new Response(
        JSON.stringify({
          error: "All fields (content, positionX, positionY, authorId, categoryId) are required",
        }),
        { status: 400 }
      );
    }

    // Create a new card
    const card = await prisma.card.create({
      data: {
        content,
        positionX,
        positionY,
        authorId,
        categoryId,
      },
    });

    return new Response(JSON.stringify(card), { status: 201 });
  } catch (error) {
    console.error("POST Card Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create card" }), {
      status: 500,
    });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, content, positionX, positionY } = await req.json();

    // Validate input fields
    if (!id || !content || positionX === undefined || positionY === undefined) {
      return new Response(
        JSON.stringify({
          error: "All fields (id, content, positionX, positionY) are required",
        }),
        { status: 400 }
      );
    }

    // Verify the card exists
    const existingCard = await prisma.card.findUnique({
      where: { id },
    });

    if (!existingCard) {
      return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
    }

    // Update the card
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        content,
        positionX,
        positionY,
      },
    });

    return new Response(JSON.stringify(updatedCard), { status: 200 });
  } catch (error) {
    console.error("PUT Cards Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update card" }), {
      status: 500,
    });
  }
}
