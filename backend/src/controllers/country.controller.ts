import { Request, Response } from "express";
import prisma from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Get all countries
 */
export const getCountries = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const countries = await prisma.country.findMany({
      include: {
        users: true,
        cards: true,
      },
    });
    res.status(200).json({ data: countries });
  } catch (error) {
    console.error("Get Countries Error:", error);
    res.status(500).json({ message: "Failed to fetch countries", error });
  }
};

/**
 * Get country by ID
 */
export const getCountryById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const country = await prisma.country.findUnique({
      where: { id },
      include: {
        users: true,
        cards: true,
      },
    });

    if (!country) {
      res.status(404).json({ message: "Country not found" });
      return;
    }

    res.status(200).json({ data: country });
  } catch (error) {
    console.error("Get Country By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch country", error });
  }
};

/**
 * Create country
 */
export const createCountry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, code } = req.body;

  try {
    const newCountry = await prisma.country.create({
      data: {
        name,
        code,
      },
    });

    res.status(201).json({ data: newCountry });
  } catch (error) {
    console.error("Create Country Error:", error);
    res.status(500).json({ message: "Failed to create country", error });
  }
};

/**
 * Update country
 */
export const updateCountry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { name, code } = req.body;

  try {
    const updatedCountry = await prisma.country.update({
      where: { id },
      data: {
        name,
        code,
      },
    });

    res.status(200).json({ data: updatedCountry });
  } catch (error) {
    console.error("Update Country Error:", error);
    res.status(500).json({ message: "Failed to update country", error });
  }
};

/**
 * Delete country
 */
export const deleteCountry = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    await prisma.country.delete({
      where: { id },
    });

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    console.error("Delete Country Error:", error);
    res.status(500).json({ message: "Failed to delete country", error });
  }
};
