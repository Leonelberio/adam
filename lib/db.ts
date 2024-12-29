import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "data/db.json");

/**
 * Reads the database JSON file
 */
export async function readDatabase() {
  const data = await fs.readFile(dbPath, "utf8");
  return JSON.parse(data);
}

/**
 * Writes to the database JSON file
 */
export async function writeDatabase(data: any) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
}
