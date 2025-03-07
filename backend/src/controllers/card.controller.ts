import { Request, Response } from "express";
import prisma from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Get all cards
 */
export const getCards = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const cards = await prisma.card.findMany({
      include: {
        creator: true,
        country: true,
        category: true,
      },
    });
    res.status(200).json({ data: cards });
  } catch (error) {
    console.error("Get Cards Error:", error);
    res.status(500).json({ message: "Failed to fetch cards", error });
  }
};

/**
 * Get card by ID
 */
export const getCardById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        creator: true,
        country: true,
        category: true,
      },
    });

    if (!card) {
      res.status(404).json({ message: "Card not found" });
      return;
    }

    res.status(200).json({ data: card });
  } catch (error) {
    console.error("Get Card By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch card", error });
  }
};

/**
 * Create card
 */
export const createCard = async (req: AuthenticatedRequest, res: Response) => {
  const { content, creatorId, countryId, categoryId, positionX, positionY } =
    req.body;

  try {
    const newCard = await prisma.card.create({
      data: {
        content,
        creatorId,
        countryId,
        categoryId,
        positionX,
        positionY,
      },
    });

    res.status(201).json({ data: newCard });
  } catch (error) {
    console.error("Create Card Error:", error);
    res.status(500).json({ message: "Failed to create card", error });
  }
};

/**
 * Update card
 */
export const updateCard = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { content, categoryId, positionX, positionY } = req.body;

  try {
    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        content,
        categoryId,
        positionX,
        positionY,
      },
    });

    res.status(200).json({ data: updatedCard });
  } catch (error) {
    console.error("Update Card Error:", error);
    res.status(500).json({ message: "Failed to update card", error });
  }
};

/**
 * Delete card
 */
export const deleteCard = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.card.delete({
      where: { id },
    });

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Delete Card Error:", error);
    res.status(500).json({ message: "Failed to delete card", error });
  }
};
