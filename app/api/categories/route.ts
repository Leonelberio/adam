
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch categories" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const categories = await req.json();

    if (!Array.isArray(categories)) {
      return new Response(
        JSON.stringify({ error: "Request body must be an array of categories" }),
        { status: 400 }
      );
    }

    const createdCategories = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true, // Avoid duplication errors if some categories already exist
    });

    return new Response(JSON.stringify({ success: true, createdCategories }), {
      status: 201,
    });
  } catch (error) {
    console.error("POST Categories Error:", error);
    return new Response(JSON.stringify({ error: "Failed to add categories" }), {
      status: 500,
    });
  }
}
  
  export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
  
    if (!id) {
      return new Response(JSON.stringify({ error: "Category ID is required" }), {
        status: 400,
      });
    }
  
    try {
      const category = await prisma.category.delete({
        where: { id },
      });
  
      return new Response(JSON.stringify(category), { status: 200 });
    } catch (error) {
      console.error("DELETE Category Error:", error);
  
      return new Response(
        JSON.stringify({ error: "Failed to delete category" }),
        { status: 500 }
      );
    }
  }
  