import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Increment the reports field
    const updatedCard = await prisma.card.update({
      where: { id: params.id },
      data: { reports: { increment: 1 } },
    });

    // Automatically hide the card if reports exceed a threshold (e.g., 5)
    if (updatedCard.reports >= 5) {
      await prisma.card.update({
        where: { id: params.id },
        data: { content: "[Content Hidden - Reported]" }, // Optional: mark the content as hidden
      });
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error reporting card:", error);
    return NextResponse.json({ error: "Failed to report card" }, { status: 500 });
  }
}
