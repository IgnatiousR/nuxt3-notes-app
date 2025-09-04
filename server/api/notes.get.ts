import { getNotesByUserId } from '~/src/queries/select';
import jwt from 'jsonwebtoken';
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const jwtCookie = getCookie(event, 'NotesJWT');
    // console.log('Cookie:', jwtCookie);
    if (!jwtCookie) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authorized to update',
      });
    }

    let decoded = null;
    if (typeof jwtCookie == 'string') {
      decoded = jwt.verify(jwtCookie, config.jwtSecret);
      // console.log('D:', decoded.id);
    }

    if (decoded?.id) {
      const notes = await getNotesByUserId(1);
      return notes;
    }
  } catch (err) {
    console.error(err);
  }
});
