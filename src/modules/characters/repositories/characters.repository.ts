import { Injectable } from "@nestjs/common";
import { and, count, eq, ilike, sql } from "drizzle-orm";

import type { CharactersQueryOptions } from "../types";
import type {
  ICharactersRepository,
  InsertCharacter,
  SelectCharacter,
} from "./characters.repository.interface";

import { characters, planets } from "../../database/schema";
import { DatabaseService } from "../../database/services/database.service";

@Injectable()
export class CharactersRepository implements ICharactersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findById(id: string): Promise<SelectCharacter | null> {
    const [character] = await this.databaseService.client
      .select()
      .from(characters)
      .where(eq(characters.id, id))
      .limit(1);

    return character || null;
  }

  async findMany(
    options: CharactersQueryOptions = {},
  ): Promise<ReadonlyArray<SelectCharacter>> {
    const { page = 1, limit = 10, search, planetId } = options;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (search) {
      conditions.push(ilike(characters.name, `%${search}%`));
    }
    if (planetId) {
      conditions.push(eq(characters.planetId, planetId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    return this.databaseService.client
      .select()
      .from(characters)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
  }

  async countTotal(
    options: Pick<CharactersQueryOptions, "search" | "planetId"> = {},
  ): Promise<number> {
    const { search, planetId } = options;

    const conditions = [];
    if (search) {
      conditions.push(ilike(characters.name, `%${search}%`));
    }
    if (planetId) {
      conditions.push(eq(characters.planetId, planetId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [result] = await this.databaseService.client
      .select({ count: count() })
      .from(characters)
      .where(whereClause);

    return result?.count || 0;
  }

  async findWithPlanet(
    id: string,
  ): Promise<
    (SelectCharacter & { planet: { id: string; name: string } | null }) | null
  > {
    const [result] = await this.databaseService.client
      .select({
        id: characters.id,
        name: characters.name,
        planetId: characters.planetId,
        createdAt: characters.createdAt,
        updatedAt: characters.updatedAt,
        planet: {
          id: planets.id,
          name: planets.name,
        },
      })
      .from(characters)
      .leftJoin(planets, eq(characters.planetId, planets.id))
      .where(eq(characters.id, id))
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      name: result.name,
      planetId: result.planetId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      planet: result.planet?.id
        ? {
            id: result.planet.id,
            name: result.planet.name,
          }
        : null,
    };
  }

  async create(character: InsertCharacter): Promise<SelectCharacter | null> {
    const [newCharacter] = await this.databaseService.client
      .insert(characters)
      .values(character)
      .returning();

    return newCharacter || null;
  }

  async update(
    id: string,
    character: Partial<InsertCharacter>,
  ): Promise<SelectCharacter | null> {
    const [updatedCharacter] = await this.databaseService.client
      .update(characters)
      .set({
        ...character,
        updatedAt: sql`now()`,
      })
      .where(eq(characters.id, id))
      .returning();

    return updatedCharacter || null;
  }

  async delete(id: string): Promise<void> {
    await this.databaseService.client
      .delete(characters)
      .where(eq(characters.id, id));
  }
}
