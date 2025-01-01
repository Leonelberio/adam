import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Increment the likes field
    const updatedCard = await prisma.card.update({
      where: { id: params.id },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error liking card:", error);
    return NextResponse.json({ error: "Failed to like card" }, { status: 500 });
  }
}
