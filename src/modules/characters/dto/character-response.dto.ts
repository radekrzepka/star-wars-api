import { ApiProperty } from "@nestjs/swagger";

export class CharacterDto {
  @ApiProperty({
    description: "Unique identifier for the character",
    example: "550e8400-e29b-41d4-a716-446655440000",
    format: "uuid",
  })
  readonly id!: string;

  @ApiProperty({
    description: "Character name",
    example: "Luke Skywalker",
  })
  readonly name!: string;

  @ApiProperty({
    description: "UUID of the planet this character is from",
    example: "550e8400-e29b-41d4-a716-446655440000",
    format: "uuid",
    nullable: true,
  })
  readonly planetId!: string | null;

  @ApiProperty({
    description: "When the character was created",
    example: "2024-01-01T00:00:00.000Z",
    type: "string",
    format: "date-time",
  })
  readonly createdAt!: Date;

  @ApiProperty({
    description: "When the character was last updated",
    example: "2024-01-01T00:00:00.000Z",
    type: "string",
    format: "date-time",
  })
  readonly updatedAt!: Date;
}

export class PlanetDto {
  @ApiProperty({
    description: "Unique identifier for the planet",
    example: "550e8400-e29b-41d4-a716-446655440000",
    format: "uuid",
  })
  readonly id!: string;

  @ApiProperty({
    description: "Planet name",
    example: "Tatooine",
  })
  readonly name!: string;
}

export class CharacterWithPlanetDto extends CharacterDto {
  @ApiProperty({
    description: "Planet information",
    type: PlanetDto,
    nullable: true,
  })
  readonly planet!: PlanetDto | null;
}

export class PaginationDto {
  @ApiProperty({
    description: "Current page number",
    example: 1,
    minimum: 1,
  })
  readonly page!: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  readonly limit!: number;

  @ApiProperty({
    description: "Total number of items",
    example: 50,
    minimum: 0,
  })
  readonly total!: number;

  @ApiProperty({
    description: "Total number of pages",
    example: 5,
    minimum: 0,
  })
  readonly totalPages!: number;
}

export class CharacterResponseDto {
  @ApiProperty({
    description: "Character data",
    type: CharacterDto,
  })
  readonly data!: CharacterDto;
}

export class CharacterWithPlanetResponseDto {
  @ApiProperty({
    description: "Character data with planet information",
    type: CharacterWithPlanetDto,
  })
  readonly data!: CharacterWithPlanetDto;
}

export class CharactersResponseDto {
  @ApiProperty({
    description: "Array of characters",
    type: [CharacterDto],
  })
  readonly data!: ReadonlyArray<CharacterDto>;

  @ApiProperty({
    description: "Pagination information",
    type: PaginationDto,
  })
  readonly pagination!: PaginationDto;
}
