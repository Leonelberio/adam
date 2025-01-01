import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Update with your actual Prisma instance path

export async function GET() {
  try {
    // Get top thinkers (users who added the most cards)
    const topThinkers = await prisma.card.groupBy({
      by: ["creatorId"],
      _count: { creatorId: true },
      orderBy: { _count: { creatorId: "desc" } },
      take: 10, // Top 10 thinkers
    });

    // Fetch additional details for top thinkers
    const thinkersDetails = await Promise.all(
      topThinkers.map(async (thinker) => {
        const user = await prisma.user.findUnique({
          where: { id: thinker.creatorId },
        });
        return {
          id: thinker.creatorId,
          name: user?.name || "Unknown",
          cardCount: thinker._count.creatorId,
        };
      })
    );

    // Get top countries (countries with the most cards)
    const topCountries = await prisma.card.groupBy({
      by: ["countryId"],
      _count: { countryId: true },
      orderBy: { _count: { countryId: "desc" } },
      take: 10, // Top 10 countries
    });

    // Fetch additional details for top countries
    const countriesDetails = await Promise.all(
      topCountries.map(async (country) => {
        const countryInfo = await prisma.country.findUnique({
          where: { id: country.countryId },
        });
        return {
          id: country.countryId,
          name: countryInfo?.name || "Unknown",
          cardCount: country._count.countryId,
        };
      })
    );

    return NextResponse.json({
      topThinkers: thinkersDetails,
      topCountries: countriesDetails,
    });
  } catch (error) {
    console.error("Failed to fetch statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
