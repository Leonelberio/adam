import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { country: true }, // Include related country information
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}


export async function POST(req: Request) {
    try {
      const { name, email, password, countryId } = await req.json();
  
      // Validate required fields
      if (!name || !email || !countryId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password, // Hash password before storing if authentication is enabled
          countryId,
        },
      });
  
      return NextResponse.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
  }