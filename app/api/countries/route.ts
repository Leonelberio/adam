import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const { name, code } = await req.json();

  if (!name || !code) {
    return NextResponse.json({ error: "Name and code are required" }, { status: 400 });
  }

  const country = await prisma.country.create({
    data: {
      name,
      code,
    },
  });

  return NextResponse.json(country, { status: 201 });
}


export async function GET() {
  try {
    // Fetch countries from the database
    const countries = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
        code: true,
      },
    });

    // Return countries as JSON
    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}
