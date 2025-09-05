import jwt from "jsonwebtoken";
import { deleteNote } from "~/src/queries/delete";
import { getNoteById } from "~/src/queries/select";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const config = useRuntimeConfig();
    const jwtCookie = getCookie(event, "NotesJWT");

    // const cookies = parseCookies(event);
    // const token = cookies.NoteNestJWT;

    if (!jwtCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: "Not authorized to update",
      });
    }

    const decodedToken = jwt.verify(jwtCookie, config.jwtSecret);

    const noteTryingToDelete = await await getNoteById(Number(id));

    if (!noteTryingToDelete) {
      throw createError({
        statusCode: 401,
        statusMessage: "Note does not exist",
      });
    }

    if (noteTryingToDelete.userId !== decodedToken.id) {
      throw createError({
        statusCode: 401,
        statusMessage: "Does not have permission to update note",
      });
    }

    const n = await deleteNote(id);
    console.log("Deleted:", n);
  } catch (err) {
    console.log(err);
  }
});
