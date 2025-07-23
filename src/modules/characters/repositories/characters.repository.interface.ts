import type { characters } from "../../database/schema";
import type { CharactersQueryOptions } from "../types";

export type InsertCharacter = typeof characters.$inferInsert;
export type SelectCharacter = typeof characters.$inferSelect;

export interface ICharactersRepository {
  findById(id: string): Promise<SelectCharacter | null>;
  findMany(
    options?: CharactersQueryOptions,
  ): Promise<ReadonlyArray<SelectCharacter>>;
  countTotal(
    options?: Pick<CharactersQueryOptions, "search" | "planetId">,
  ): Promise<number>;
  findWithPlanet(
    id: string,
  ): Promise<
    (SelectCharacter & { planet: { id: string; name: string } | null }) | null
  >;
  create(character: InsertCharacter): Promise<SelectCharacter | null>;
  update(
    id: string,
    character: Partial<InsertCharacter>,
  ): Promise<SelectCharacter | null>;
  delete(id: string): Promise<void>;
}
