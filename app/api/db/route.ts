import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data/db.json");

/**
 * Reads the database JSON file
 */
async function readDatabase() {
  const data = await fs.readFile(dbPath, "utf8");
  return JSON.parse(data);
}

/**
 * Writes to the database JSON file
 */
async function writeDatabase(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET(req: Request) {
  try {
    const data = await readDatabase();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(JSON.stringify({ error: "Failed to read database" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { type, payload } = await req.json();
    const db = await readDatabase();

    if (type === "addUser") {
      db.users.push(payload);
    } else if (type === "addCard") {
      db.cards.push(payload);
    } else if (type === "updateCard") {
      const cardIndex = db.cards.findIndex((card: any) => card.id === payload.id);
      if (cardIndex > -1) {
        db.cards[cardIndex] = payload;
      }
    }

    await writeDatabase(db);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update database" }), {
      status: 500,
    });
  }
}
