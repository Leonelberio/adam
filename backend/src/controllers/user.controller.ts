import { Request, Response } from "express";
import prisma from "../db/prisma";
import { hashPassword } from "../utils/password.util";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

/**
 * Get all users
 */
export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        country: true, // Include related country
      },
    });
    res.status(200).json({ data: users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        country: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};

/**
 * Create user
 */
export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  const { firstName, lastName, email, password, countryId } = req.body;
  try {
    // Hash the password
    const hashedPassword = password ? await hashPassword(password) : null;

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        countryId,
      },
    });

    res.status(201).json({ data: newUser });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

/**
 * Update user
 */
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, countryId } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        countryId,
      },
    });

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Failed to update user", error });
  }
};

/**
 * Delete user
 */
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Failed to delete user", error });
  }
};
