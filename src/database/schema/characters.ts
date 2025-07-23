import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { planets } from "./planets";

export const characters = pgTable("characters", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  planetId: uuid("planet_id").references(() => planets.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
