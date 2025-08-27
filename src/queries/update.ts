import { eq } from 'drizzle-orm';
import { notesTable, usersTable, type InsertNote, type SelectNote, type SelectUser } from '../db/schema';
import { db } from '../db/db';

export async function updateUser(id: SelectUser['id'], data: Partial<Omit<SelectUser, 'id'>>) {
  const [updatedUser] = await db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning();
  // return updatedUser ?? null;
  return Object.keys(updatedUser).length > 0 ? updatedUser : null;
}

export async function updateNote(id: SelectNote['id'], data: Partial<Omit<InsertNote, 'id' | 'userId'>>) {
  const [updatedNote] = await db
    .update(notesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(notesTable.id, id))
    .returning();
  return Object.keys(updatedNote).length > 0 ? updatedNote : null;
  // return updatedNote ?? null;
}
