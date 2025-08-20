import { db } from "../db/db";
import { usersTable, type InsertUser } from "../db/schema";

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}
