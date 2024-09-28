// this schema is set up for use with the Drizzle-orm
// Currently it defines two tables:
//  users: where users are stored and managed
//  sample: a simple table as an example to show how do actions on this table
// Becase we use sessions we also have another table "session_table" that we use to store
//    sessions, but that is never handled by drizzle-orm and hence not mentioned here


import {
  pgTable, integer, numeric, pgEnum, serial,
  date, timestamp, uniqueIndex, json,
  text, char, varchar, doublePrecision
} from 'drizzle-orm/pg-core'
import {CompletionInfoFlags} from "typescript"

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fname: varchar('fname', {length: 60}),
  lname: varchar('lname', {length: 60}),
  username: varchar('username', {length: 10}),
  email: varchar('email', {length: 128}).notNull().unique(),
  password: varchar('password', {length: 90}),
  regkey: varchar('regkey', {length: 90}),
  chgkey: varchar('chgkey', {length: 90})
})

export const sample = pgTable('sample', {
  id: serial('id').primaryKey(),
  title: varchar('title', {length: 150}),
  body: text('body'),
  data: text('data'),
  userid: integer('userid').references(() => users.id),
  ts: timestamp('ts', {withTimezone: false})
})

