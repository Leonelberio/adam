import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const cards = await prisma.card.findMany({
      select: {
        id: true,
        content: true,
        likes: true,
        reports: true,
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching likes and reports:", error);
    return NextResponse.json({ error: "Failed to fetch likes and reports" }, { status: 500 });
  }
}
