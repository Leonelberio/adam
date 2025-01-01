import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { likes, reports } = await req.json();

    const updatedCard = await prisma.card.update({
      where: { id: params.id },
      data: {
        likes: likes ?? 0, // Reset likes if provided
        reports: reports ?? 0, // Reset reports if provided
      },
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error resetting card stats:", error);
    return NextResponse.json({ error: "Failed to reset card stats" }, { status: 500 });
  }
}
