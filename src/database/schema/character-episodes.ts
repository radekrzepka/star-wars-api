import { pgTable, uuid } from "drizzle-orm/pg-core";

import { characters } from "./characters";
import { episodes } from "./episodes";

export const characterEpisodes = pgTable("character_episodes", {
  characterId: uuid("character_id")
    .notNull()
    .references(() => characters.id, { onDelete: "cascade" }),
  episodeId: uuid("episode_id")
    .notNull()
    .references(() => episodes.id, { onDelete: "cascade" }),
});
