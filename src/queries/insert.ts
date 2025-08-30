import { db } from "../db/db";
import { notesTable, usersTable, type InsertNote, type InsertUser } from "../db/schema";

export async function createUser(data: InsertUser) {
  const [newUser] = await db.insert(usersTable).values(data).returning();
  return newUser;
}

export async function createNote(note: InsertNote) {
  const [newNote] = await db.insert(notesTable).values(note).returning();
  return newNote;
}
