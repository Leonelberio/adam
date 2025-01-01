import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/utils/password";
import { z } from "zod";

// Define a validation schema for the input
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  countryId: z.string().min(1, "Country is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the input using Zod
    const { name, email, password, countryId } = registerSchema.parse(body);

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Ensure the country exists
    const country = await prisma.country.findUnique({ where: { id: countryId } });
    if (!country) {
      return NextResponse.json({ error: "Invalid country" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        countryId,
      },
    });

    return NextResponse.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
