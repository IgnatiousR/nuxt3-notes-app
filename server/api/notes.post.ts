import jwt from 'jsonwebtoken';
import type { notesTable } from '~/src/db/schema';
import { createNote } from '~/src/queries/insert';

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const jwtCookie = getCookie(event, 'NotesJWT');

    if (!jwtCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authorized to update',
      });
    }

    const decodedToken = jwt.verify(jwtCookie, config.jwtSecret);

    const note: typeof notesTable.$inferInsert = {
      title: '',
      content: '',
      userId: decodedToken?.id,
    };

    const newNote = await createNote(note);

    return newNote;
  } catch (err) {
    console.error(err);
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not verify jwt',
    });
  }
});
