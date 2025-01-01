import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fetch all cards
export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      include: { creator: true, country: true, category: true },
    });
    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json({ error: "Failed to fetch cards" }, { status: 500 });
  }
}

// Create a new card
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, creatorId, countryId, categoryId, positionX, positionY } = body;

    const card = await prisma.card.create({
      data: {
        content,
        creatorId,
        countryId,
        categoryId,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json({ error: "Failed to create card" }, { status: 500 });
  }
}