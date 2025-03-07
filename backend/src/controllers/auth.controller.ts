import { Request, Response } from "express";
import prisma from "../db/prisma";
import { hashPassword, verifyPassword } from "../utils/password.util";
import { generateToken } from "../utils/jwt.util";

/**
 * Sign Up Controller
 * Registers a new user.
 */
export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, countryId } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email is already in use." });
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        countryId,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        countryId: newUser.countryId,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Failed to create user", error });
  }
};

/**
 * Sign In Controller
 * Authenticates a user, generates a JWT token, and returns it.
 */
export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password || "");
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password." });
      return;
    }

    // Generate a JWT token
    const token = generateToken(user.id);

    // Create a session in the database
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // Token expires in 1 day
      },
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Failed to login", error });
  }
};

/**
 * Logout Controller
 * Deletes the user session from the database.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    // Delete the session from the database
    await prisma.session.deleteMany({
      where: { token },
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Failed to logout", error });
  }
};
