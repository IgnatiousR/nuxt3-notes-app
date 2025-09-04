import jwt from 'jsonwebtoken';
import { getNoteById } from '~/src/queries/select';
import { updateNote } from '~/src/queries/update';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getRouterParam(event, 'id');

    // const cookies = parseCookies(event)
    // const token = cookies.NoteNestJWT

    const config = useRuntimeConfig();
    const jwtCookie = getCookie(event, 'NotesJWT');

    if (!jwtCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authorized to update',
      });
    }

    const decodedToken = jwt.verify(jwtCookie, config.jwtSecret);

    const noteTryingToUpdate = await getNoteById(Number(id));

    if (!noteTryingToUpdate) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Note does not exist',
      });
    }

    if (noteTryingToUpdate.userId !== decodedToken.id) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Does not have permission to update note',
      });
    }

    console.log(id);
    console.log(body);

    // await updateNote(decodedToken.id, body);
  } catch (err) {
    console.log(err);
  }
});
