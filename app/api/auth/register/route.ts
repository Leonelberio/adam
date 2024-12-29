import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { name, email, password, country } = await req.json();

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "Email already registered" }, { status: 400 });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, country },
  });

  return NextResponse.json(user, { status: 201 });
}
