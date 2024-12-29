import { prisma } from "@/lib/prisma";
export async function GET() {
  try {
    // Fetch all users, including their cards and sessions for demonstration
    const users = await prisma.user.findMany({
      include: {
        cards: true,
        sessions: true,
      },
    });

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("GET Users Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password, country } = await req.json();

    // Basic validation
    if (!name || !email || !password || !country) {
      return new Response(
        JSON.stringify({ error: "Name, email, password, and country are required" }),
        { status: 400 }
      );
    }

    // Check if the email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "A user with this email already exists" }),
        { status: 400 }
      );
    }

    // Hash the password before storing (for real-world usage)
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        country,
      },
    });

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("POST Users Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }
}
