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

import prisma from "~/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    // Sends to database
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: passwordHash,
        salt: salt,
      },
    });
    const token = jwt.sign({ id: user.id }, config.jwtSecret);
    console.log("Token:", token);

    setCookie(event, "NotesJWT", token, {
      maxAge: 60 * 60 * 12, // seconds
    });

    //console.log("Sec:", body);
    return { data: "success" };
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      throw createError({
        statusCode: 409,
        message: "An email with this address already exists.",
      });
    }

    console.error("Unexpected error:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });

    //console.log("er:", error);
    // if (error.code === "P2002") {
    //   throw createError({
    //     statusCode: 409,
    //     message: "An email with this address already exists.",
    //   });
    // }
    //throw error;
  }
});
