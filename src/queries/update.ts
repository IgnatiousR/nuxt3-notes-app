import { eq } from "drizzle-orm";
import { usersTable, type SelectUser } from "../db/schema";
import { db } from "../db/db";

export async function updateUser(
  id: SelectUser["id"],
  data: Partial<Omit<SelectUser, "id">>
) {
  await db.update(usersTable).set(data).where(eq(usersTable.id, id));
}
