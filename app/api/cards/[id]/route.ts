import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid card ID" }), { status: 400 });
  }

  try {
    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return new Response(JSON.stringify({ error: "Card not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(card), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid card ID" }), { status: 400 });
  }

  try {
    const { content, categoryId, positionX, positionY } = await req.json();

    const updatedCard = await prisma.card.update({
      where: { id },
      data: { content, categoryId, positionX, positionY },
    });

    return new Response(JSON.stringify(updatedCard), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: "Invalid card ID" }), { status: 400 });
  }

  try {
    await prisma.card.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
