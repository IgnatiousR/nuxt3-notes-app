import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import db from "~/src";
import { getUserByEmail } from "~/src/queries/select";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  try {
    const body = await readBody(event);
    console.log("Body:", body);

    const user = await getUserByEmail(body.email);
    if (user.length === 0) {
      throw createError({
        statusCode: 400,
        message: "Invalid Credentials",
      });
    }
    console.log("U:", user);

    // const passwordHash = await bcrypt.hash(body.password, user[0].salt);
    const isValid = await bcrypt.compare(body.password, user[0].password);
    console.log("Validity:", isValid);

    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign({ id: user[0].id }, config.jwtSecret);
    setCookie(event, "NotesJWT", token, {
      maxAge: 60 * 60 * 12, // seconds
    });

    return { data: "success" };
  } catch (error) {
    console.log("Er from server:", error);
    if (error?.message) {
      throw createError({
        statusCode: 409,
        message: error?.message,
      });
    }

    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
