// import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import * as t from 'drizzle-orm/pg-core';

export const usersTable = t.pgTable('users', {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar({ length: 255 }).notNull(),
  email: t.varchar({ length: 255 }).notNull().unique(),
  password: t.varchar({ length: 255 }).notNull(),
  salt: t.varchar({ length: 255 }).notNull(),
});

// export const usersTable = pgTable('users_table', {
//   id: serial('id').primaryKey(),
//   name: text('name').notNull(),
//   age: integer('age').notNull(),
//   email: text('email').notNull().unique(),
//   password: text('password').notNull(),
//   salt: text('password').notNull(),
// });

export const notesTable = t.pgTable('notes', {
  id: t.serial('id').primaryKey(),
  title: t.varchar('title', { length: 255 }).notNull(),
  content: t.text('content').notNull(),
  userId: t
    .integer('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp('created_at').notNull().defaultNow(),
  updatedAt: t
    .timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertNote = typeof notesTable.$inferInsert;
export type SelectNote = typeof notesTable.$inferSelect;
