import { eq } from "drizzle-orm";
import { notesTable, usersTable, type SelectNote, type SelectUser } from "../db/schema";
import { db } from "../db/db";

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function deleteNote(id: SelectNote["id"]) {
  const [deletedNote] = await db.delete(notesTable).where(eq(notesTable.id, id)).returning();

  return deletedNote ?? null;
}
