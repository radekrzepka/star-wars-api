import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator";

import {
  MAX_CHARACTER_NAME_LENGTH,
  MIN_CHARACTER_NAME_LENGTH,
} from "../../../constants";

export class UpdateCharacterDto {
  @ApiPropertyOptional({
    description: `Character name (${MIN_CHARACTER_NAME_LENGTH}-${MAX_CHARACTER_NAME_LENGTH} characters)`,
    example: "Luke Skywalker",
    minLength: MIN_CHARACTER_NAME_LENGTH,
    maxLength: MAX_CHARACTER_NAME_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MinLength(MIN_CHARACTER_NAME_LENGTH)
  @MaxLength(MAX_CHARACTER_NAME_LENGTH)
  readonly name?: string;

  @ApiPropertyOptional({
    description: "UUID of the planet this character is from",
    example: "550e8400-e29b-41d4-a716-446655440000",
    format: "uuid",
  })
  @IsOptional()
  @IsUUID()
  readonly planetId?: string;
}
