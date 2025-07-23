import { Injectable, NotFoundException } from "@nestjs/common";

import type {
  CharacterDto,
  CharactersResponseDto,
  CharacterWithPlanetDto,
  CreateCharacterDto,
  UpdateCharacterDto,
} from "../dto";
import type { CharactersQueryOptions } from "../types";

import { CharactersRepository } from "../repositories/characters.repository";

@Injectable()
export class CharactersService {
  constructor(private readonly charactersRepository: CharactersRepository) {}

  async createCharacter(
    createCharacterDto: CreateCharacterDto,
  ): Promise<CharacterDto> {
    const newCharacter = await this.charactersRepository.create({
      name: createCharacterDto.name,
      planetId: createCharacterDto.planetId || null,
    });

    if (!newCharacter) {
      throw new Error("Failed to create character");
    }

    return newCharacter;
  }

  async findCharacters(
    params: CharactersQueryOptions = {},
  ): Promise<CharactersResponseDto> {
    const options: CharactersQueryOptions = {
      page: params.page || 1,
      limit: Math.min(params.limit || 10, 100),
      search: params.search,
      planetId: params.planetId,
    };

    const [charactersData, totalCount] = await Promise.all([
      this.charactersRepository.findMany(options),
      this.charactersRepository.countTotal({
        search: options.search,
        planetId: options.planetId,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / (options.limit || 10));

    return {
      data: charactersData,
      pagination: {
        page: options.page || 1,
        limit: options.limit || 10,
        total: totalCount,
        totalPages,
      },
    };
  }

  async findCharacterById(characterId: string): Promise<CharacterDto> {
    const character = await this.charactersRepository.findById(characterId);

    if (!character) {
      throw new NotFoundException(
        `Character with ID "${characterId}" not found`,
      );
    }

    return character;
  }

  async findCharacterWithPlanet(
    characterId: string,
  ): Promise<CharacterWithPlanetDto> {
    const result = await this.charactersRepository.findWithPlanet(characterId);

    if (!result) {
      throw new NotFoundException(
        `Character with ID "${characterId}" not found`,
      );
    }

    return result;
  }

  async updateCharacter(
    characterId: string,
    updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterDto> {
    await this.findCharacterById(characterId);

    const updatedCharacter = await this.charactersRepository.update(
      characterId,
      updateCharacterDto,
    );

    if (!updatedCharacter) {
      throw new Error("Failed to update character");
    }

    return updatedCharacter;
  }

  async deleteCharacter(characterId: string): Promise<void> {
    await this.findCharacterById(characterId);
    await this.charactersRepository.delete(characterId);
  }
}
