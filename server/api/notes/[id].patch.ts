import jwt from "jsonwebtoken";
import { getNoteById } from "~/src/queries/select";
import { updateNote } from "~/src/queries/update";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getRouterParam(event, "id");
    // console.log("B:", body.title);
    // console.log("B:", body);
    // console.log("ID:", id);

    const config = useRuntimeConfig();
    const jwtCookie = getCookie(event, "NotesJWT");

    if (!jwtCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not authorized to update",
      });
    }

    const decodedToken = jwt.verify(jwtCookie, config.jwtSecret);
    // console.log("decode:", decodedToken.id);

    const noteTryingToUpdate = await getNoteById(Number(id));
    // console.log("To updtae:", noteTryingToUpdate);

    if (!noteTryingToUpdate) {
      throw createError({
        statusCode: 401,
        statusMessage: "Note does not exist",
      });
    }

    if (noteTryingToUpdate.userId !== decodedToken.id) {
      throw createError({
        statusCode: 401,
        statusMessage: "Does not have permission to update note",
      });
    }

    const n = await updateNote(id, body);
    console.log("Updated:", n);
  } catch (err) {
    console.log(err);
  }
});
