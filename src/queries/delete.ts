import { eq } from "drizzle-orm";
import { usersTable, type SelectUser } from "../db/schema";
import { db } from "../db/db";

export async function deleteUser(id: SelectUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}
