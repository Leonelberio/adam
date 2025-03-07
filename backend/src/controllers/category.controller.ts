import { Request, Response } from "express";
import prisma from "../db/prisma";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Get all categories
 */
export const getCategories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        cards: true, // Include cards related to the category
      },
    });
    res.status(200).json({ data: categories });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ message: "Failed to fetch categories", error });
  }
};

/**
 * Get category by ID
 */
export const getCategoryById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        cards: true, // Include cards related to the category
      },
    });

    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ data: category });
  } catch (error) {
    console.error("Get Category By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch category", error });
  }
};

/**
 * Create category
 */
export const createCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name } = req.body;

  try {
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json({ data: newCategory });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ message: "Failed to create category", error });
  }
};

/**
 * Update category
 */
export const updateCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });

    res.status(200).json({ data: updatedCategory });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ message: "Failed to update category", error });
  }
};

/**
 * Delete category
 */
export const deleteCategory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ message: "Failed to delete category", error });
  }
};
