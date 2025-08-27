import { getNotesByUserId } from '~/src/queries/select';

export default defineEventHandler(async (_event) => {
  try {
    // const config = useRuntimeConfig();
    // const jwtCookie = useCookie('NotesJWT', { _event });
    // console.log(jwtCookie.value);
    // const jwtCookie = useCookie('NotesJWT');
    // if (jwtCookie.value) {
    //   const decoded = jwt.verify(jwtCookie.value, config.jwtSecret);
    //   const userId = decoded.id;
    //   console.log(decoded.id);
    // }

    const notes = await getNotesByUserId(1);
    // console.log('Notes:', notes);

    return notes;
  } catch (err) {
    console.error(err);
  }
});
