import  prisma  from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 300000); // 5 minutes ago

    // Count visitors whose lastSeen timestamp is within the last 5 minutes
    const activeVisitorsCount = await prisma.visitor.count({
      where: {
        createdAt: {
          gte: fiveMinutesAgo,
        },
      },
    });

    return new Response(JSON.stringify({ count: activeVisitorsCount }), {
      status: 200,
    });
  } catch (error) {
    console.error("GET Visitors Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch visitors" }), {
      status: 500,
    });
  }
}



export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    const currentTime = new Date();

    // Check if the visitor exists
    const existingVisitor = await prisma.visitor.findUnique({
      where: { sessionId: userId }, // Assuming userId maps to sessionId
    });

    if (existingVisitor) {
      // Update the visitor's last seen timestamp
      await prisma.visitor.update({
        where: { sessionId: userId },
        data: { createdAt: currentTime },
      });
    } else {
      // Create a new visitor record
      await prisma.visitor.create({
        data: {
          sessionId: userId,
          createdAt: currentTime,
        },
      });
    }

    return new Response(JSON.stringify({ message: "Visitor recorded" }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST Visitors Error:", error);
    return new Response(JSON.stringify({ error: "Failed to record visitor" }), {
      status: 500,
    });
  }
}
