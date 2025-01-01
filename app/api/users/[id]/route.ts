import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { country: true }, // Include related country information
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const { name, email, password, countryId } = await req.json();
  
      // Update the user
      const updatedUser = await prisma.user.update({
        where: { id: params.id },
        data: { name, email, password, countryId },
      });
  
      return NextResponse.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
  }



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Delete the user
    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
