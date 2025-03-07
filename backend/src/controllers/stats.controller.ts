import { Request, Response } from "express";
import prisma from "../db/prisma"; // Update with your actual Prisma instance path

export const getStats = async (req: Request, res: Response) => {
  try {
    // Top thinkers: users who created the most cards
    const topThinkers = await prisma.card.groupBy({
      by: ["creatorId"],
      _count: { creatorId: true },
      orderBy: { _count: { creatorId: "desc" } },
      take: 10, // Top 10
    });

    // Fetch additional details for top thinkers
    const thinkersDetails = await Promise.all(
      topThinkers.map(async (thinker) => {
        const user = await prisma.user.findUnique({
          where: { id: thinker.creatorId },
        });
        return {
          id: thinker.creatorId,
          name: user?.firstName || "Unknown",
          cardCount: thinker._count.creatorId,
        };
      })
    );

    // Top countries: countries with the most cards
    const topCountries = await prisma.card.groupBy({
      by: ["countryId"],
      _count: { countryId: true },
      orderBy: { _count: { countryId: "desc" } },
      take: 10, // Top 10
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

    // Send the stats as a response
    res.status(200).json({
      topThinkers: thinkersDetails,
      topCountries: countriesDetails,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({ message: "Failed to fetch stats", error });
  }
};
