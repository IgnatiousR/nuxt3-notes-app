import { eq } from "drizzle-orm";

import { usersTable, type SelectUser } from "../db/schema";
import { db } from "../db/db";

export async function getUserById(id: SelectUser["id"]): Promise<
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
