import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import type { CharactersQueryOptions } from "../types";

import { CreateCharacterDto, UpdateCharacterDto } from "../dto";
import {
  CharacterResponseDto,
  CharactersResponseDto,
  CharacterWithPlanetResponseDto,
} from "../dto/character-response.dto";
import { CharactersService } from "../services/characters.service";

export interface GetCharactersQuery {
  readonly page?: string;
  readonly limit?: string;
  readonly search?: string;
  readonly planetId?: string;
}

@ApiTags("characters")
@Controller("characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @ApiOperation({ summary: "Create a new character" })
  @ApiBody({
    type: CreateCharacterDto,
    description: "Character data",
  })
  @ApiResponse({
    status: 201,
    description: "Character created successfully",
    type: CharacterResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCharacter(
    @Body() createCharacterDto: CreateCharacterDto,
  ): Promise<CharacterResponseDto> {
    const character =
      await this.charactersService.createCharacter(createCharacterDto);
    return { data: character };
  }

  @ApiOperation({ summary: "Get all characters with pagination and filtering" })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 10, max: 100)",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by character name",
  })
  @ApiQuery({
    name: "planetId",
    required: false,
    type: String,
    description: "Filter by planet UUID",
  })
  @ApiResponse({
    status: 200,
    description: "Characters retrieved successfully",
    type: CharactersResponseDto,
  })
  @Get()
  async getCharacters(
    @Query() query: GetCharactersQuery,
  ): Promise<CharactersResponseDto> {
    const options: CharactersQueryOptions = {
      page: query.page ? parseInt(query.page, 10) : undefined,
      limit: query.limit ? parseInt(query.limit, 10) : undefined,
      search: query.search,
      planetId: query.planetId,
    };

    return this.charactersService.findCharacters(options);
  }

  @ApiOperation({ summary: "Get a character by ID" })
  @ApiParam({ name: "id", type: String, description: "Character UUID" })
  @ApiResponse({
    status: 200,
    description: "Character retrieved successfully",
    type: CharacterResponseDto,
  })
  @ApiResponse({ status: 404, description: "Character not found" })
  @Get(":id")
  async getCharacterById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CharacterResponseDto> {
    const character = await this.charactersService.findCharacterById(id);
    return { data: character };
  }

  @ApiOperation({ summary: "Get a character with planet information" })
  @ApiParam({ name: "id", type: String, description: "Character UUID" })
  @ApiResponse({
    status: 200,
    description: "Character with planet information retrieved successfully",
    type: CharacterWithPlanetResponseDto,
  })
  @ApiResponse({ status: 404, description: "Character not found" })
  @Get(":id/with-planet")
  async getCharacterWithPlanet(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CharacterWithPlanetResponseDto> {
    const character = await this.charactersService.findCharacterWithPlanet(id);
    return { data: character };
  }

  @ApiOperation({ summary: "Update a character by ID" })
  @ApiParam({ name: "id", type: String, description: "Character UUID" })
  @ApiBody({
    type: UpdateCharacterDto,
    description: "Character update data",
    examples: {
      "update-name": {
        summary: "Update character name",
        value: {
          name: "Darth Vader",
        },
      },
      "update-planet": {
        summary: "Update character planet",
        value: {
          planetId: "550e8400-e29b-41d4-a716-446655440000",
        },
      },
      "update-both": {
        summary: "Update name and planet",
        value: {
          name: "Luke Skywalker",
          planetId: "550e8400-e29b-41d4-a716-446655440000",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Character updated successfully",
    type: CharacterResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input data" })
  @ApiResponse({ status: 404, description: "Character not found" })
  @Patch(":id")
  async updateCharacter(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ): Promise<CharacterResponseDto> {
    const character = await this.charactersService.updateCharacter(
      id,
      updateCharacterDto,
    );
    return { data: character };
  }

  @ApiOperation({ summary: "Delete a character by ID" })
  @ApiParam({ name: "id", type: String, description: "Character UUID" })
  @ApiResponse({ status: 204, description: "Character deleted successfully" })
  @ApiResponse({ status: 404, description: "Character not found" })
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCharacter(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.charactersService.deleteCharacter(id);
  }
}
