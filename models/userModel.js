import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

async function readDB() {
  const raw = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeDB(db) {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

export const User = {
  /**
   * @param {{name: string, email: string, passwordHash: string}} data
   */
  async create(data) {
    const db = await readDB();
    const newUser = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      preferences: {
        interests: [],
        season: "",
        climate: "",
        safariType: "",
      },
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    await writeDB(db);
    return newUser;
  },

  async findByEmail(email) {
    const db = await readDB();
    return db.users.find((u) => u.email === email.toLowerCase()) || null;
  },

  async findById(id) {
    const db = await readDB();
    return db.users.find((u) => u.id === id) || null;
  },

  /**
   * @param {string} id
   * @param {object} updates - partial fields to merge (e.g. { name }, { preferences })
   */
  async updateById(id, updates) {
    const db = await readDB();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = {
      ...db.users[idx],
      ...updates,
      preferences: updates.preferences
        ? { ...db.users[idx].preferences, ...updates.preferences }
        : db.users[idx].preferences,
    };
    await writeDB(db);
    return db.users[idx];
  },
};

export function toPublicUser(user) {
  if (!user) return null;
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}