import { getNotesByUserId } from "~/src/queries/select";

export default defineEventHandler(async (_event) => {
  try {
    // const notes = await db
    //   .select()
    //   .from(notesTable)
    //   .where(eq(notesTable.userId, userId))
    //   .orderBy(notesTable.createdAt);
    const notes = await getNotesByUserId(1);
    console.log("Notes:", notes);

    return notes;
  } catch (err) {
    console.error(err);
  }
});
