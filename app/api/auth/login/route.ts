import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { comparePasswords } from "@/utils/password";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password: inputPassword } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
      include: { country: true },
    });

    if (
      !user ||
      !user.password ||
      !comparePasswords(inputPassword, user.password)
    ) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const { ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
