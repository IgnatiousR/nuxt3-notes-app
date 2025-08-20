import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import db from "~/src";
import { db } from "~/src/db/db";
import type { SelectUser } from "~/src/db/schema";
import { usersTable } from "~/src/db/schema";
import { eq } from "drizzle-orm";

// export async function getUserByEm(email: string) {
//   const result = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, email))
//     .limit(1);

//   return result[0] ?? null;
// }

async function getUserByEmail(email: SelectUser["email"]): Promise<
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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);
    console.log("Bod:", body);

    //const salt = await bcrypt.genSalt(10);
    const user = getUserByEmail(body.email);
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, body.email))
      .limit(1);
    console.log("U:", user);
    console.log("R:", result); //R[0].password
    // const isValid = await bcrypt.compare(body.password, user.password)
    // const passwordHash = await bcrypt.hash(body.password, salt);

    // db.select().from(usersTable).where(eq(usersTable.email, body.email));

    // const user: typeof usersTable.$inferInsert = {
    //   name: body.name,
    //   email: body.email,
    //   password: passwordHash,
    //   salt: salt,
    // };

    // Sends to database
    // await db.insert(usersTable).values(user);
    // const [newUser] = await db.insert(usersTable).values(user).returning();
    // const token = jwt.sign({ id: newUser.id }, config.jwtSecret);
    // console.log("Token:", token);
    // console.log("U:", newUser);

    // setCookie(event, "NotesJWT", token, {
    //   maxAge: 60 * 60 * 12, // seconds
    // });

    //console.log("Sec:", body);
    return { data: "success" };
  } catch (error) {
    // console.log("Er:", error);
    // console.log("Ercosw:", error["cause"]);
    // console.log("Cause:", error.cause);
    const cause = error?.cause;

    if (typeof cause === "object" && cause) {
      const detail = cause.message ?? cause.detail;

      if (
        typeof detail === "string" &&
        detail.includes(
          'duplicate key value violates unique constraint "users_email_unique"'
        )
      ) {
        throw createError({
          statusCode: 409,
          message: "An account with this email already exists.",
        });
      }
    }

    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
