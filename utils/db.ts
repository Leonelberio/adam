import prisma from "@/lib/prisma";

export async function getUserFromDb(email: string, passwordHash: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && user.password === passwordHash) {
    return { id: user.id, name: user.name, email: user.email };
  }

  return null;
}
