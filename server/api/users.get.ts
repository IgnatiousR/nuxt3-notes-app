import { db } from '~/src/db/db';
import { usersTable } from '~/src/db/schema';

export default defineEventHandler(async (_event) => {
  // Example: Fetch from DB (replace with Prisma, Drizzle, etc.)
  const allUsers = await db.select().from(usersTable);
  return allUsers;
});
