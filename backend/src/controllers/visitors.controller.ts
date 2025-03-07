import { Request, Response } from "express";
import prisma from "../db/prisma"; // Adjust the path to your Prisma instance

/**
 * GET: Get count of active visitors in the last 5 minutes
 */
export const getVisitors = async (req: Request, res: Response) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 300000); // 5 minutes ago

    // Count visitors whose `createdAt` is within the last 5 minutes
    const activeVisitorsCount = await prisma.visitor.count({
      where: {
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    // Respond with the count of active visitors
    res.status(200).json({ count: activeVisitorsCount });
  } catch (error) {
    console.error("GET Visitors Error:", error);
    res.status(500).json({ error: "Failed to fetch active visitors" });
  }
};

/**
 * POST: Create or update a visitor's session
 */
export const postVisitor = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // Parse the userId from the request body

    // Validate input
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const currentTime = new Date();

    // Check if the visitor with this session ID already exists
    const existingVisitor = await prisma.visitor.findUnique({
      where: { sessionId: userId }, // Assuming userId maps to sessionId
    });

    if (existingVisitor) {
      // Update the visitor's `createdAt` timestamp
      await prisma.visitor.update({
        where: { sessionId: userId },
        data: { createdAt: currentTime },
      });
    } else {
      // Create a new visitor record
      await prisma.visitor.create({
        data: {
          sessionId: userId,
          createdAt: currentTime,
        },
      });
    }

    // Respond with a success message
    res.status(201).json({ message: "Visitor recorded" });
  } catch (error) {
    console.error("POST Visitors Error:", error);
    res.status(500).json({ error: "Failed to record visitor" });
  }
};
