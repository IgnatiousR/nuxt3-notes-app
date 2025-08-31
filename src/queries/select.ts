import { desc, eq } from 'drizzle-orm';

import { notesTable, usersTable, type SelectNote, type SelectUser } from '../db/schema';
import { db } from '../db/db';

export async function getUserById(id: SelectUser['id']): Promise<
  Array<{
    id: number;
    name: string;
    email: string;
    password: string;
    salt: string;
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.id, id));
}

export async function getUserByEmail(email: SelectUser['email']): Promise<
  Array<{
    id: number;
    name: string;
    email: string;
    password: string;
    salt: string;
  }>
> {
  return db.select().from(usersTable).where(eq(usersTable.email, email));
}

export async function getNotesByUserId(userId: SelectNote['userId']): Promise<
  Array<{
    id: number;
    title: string;
    content: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  // return db.select().from(notesTable).where(eq(notesTable.userId, userId)).orderBy(notesTable.createdAt);
  return db.select().from(notesTable).where(eq(notesTable.userId, userId)).orderBy(desc(notesTable.createdAt));
}
