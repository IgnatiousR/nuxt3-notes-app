// import validator from "validator";
// /api/user POST

// Hashing passwords
// - Prevents PW from being stored in plaintext
// - mypassword123 jnjvsadcjncuwinuiwebjksab,/#@$fasDFVCASDR$@#

// Salts
// - salt = string of random characters
// - Typically added to the beginning of a user's PW
//    - mypassword123 becomes x#fSA#Amypassword123
// - Used to prevent hackers from using precomputed hash tables to crack a PW
// - Each user gets their own salt so even if two users have the same PW
//   their password's look completely different

// Generate secret:
// - node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { usersTable } from "~/src/db/schema";
import { createUser } from "~/src/queries/insert";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const user: typeof usersTable.$inferInsert = {
      name: body.name,
      email: body.email,
      password: passwordHash,
      salt: salt,
    };

    // const [newUser] = await db.insert(usersTable).values(user).returning();
    const newUser = await createUser(user);
    const token = jwt.sign({ id: newUser.id }, config.jwtSecret);
    console.log("Token:", token);
    console.log("U:", newUser);

    setCookie(event, "NotesJWT", token, {
      maxAge: 60 * 60 * 12, // seconds
    });

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
        detail.includes('duplicate key value violates unique constraint "users_email_unique"')
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
