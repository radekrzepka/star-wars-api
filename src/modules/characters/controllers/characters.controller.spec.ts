import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type {
  CharacterDto,
  CharactersResponseDto,
  CharacterWithPlanetDto,
  CreateCharacterDto,
  UpdateCharacterDto,
} from "../dto";
import type {
  CharacterResponseDto,
  CharacterWithPlanetResponseDto,
} from "../dto/character-response.dto";
import type { CharactersQueryOptions } from "../types";
import type { GetCharactersQuery } from "./characters.controller";

import { CharactersService } from "../services/characters.service";
import { CharactersController } from "./characters.controller";

describe("CharactersController", () => {
  let controller: CharactersController;
  let mockCharactersService: jest.Mocked<CharactersService>;

  const mockCharacterData: CharacterDto = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Luke Skywalker",
    planetId: "550e8400-e29b-41d4-a716-446655440001",
    createdAt: new Date("2024-01-01T00:00:00.000Z"),
    updatedAt: new Date("2024-01-01T00:00:00.000Z"),
  };

  const mockCharacterWithPlanet: CharacterWithPlanetDto = {
    ...mockCharacterData,
    planet: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Tatooine",
    },
  };

  const mockCharactersResponse: CharactersResponseDto = {
    data: [mockCharacterData],
    pagination: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
  };

  beforeEach(async () => {
    const mockService = {
      createCharacter: jest.fn(),
      findCharacters: jest.fn(),
      findCharacterById: jest.fn(),
      findCharacterWithPlanet: jest.fn(),
      updateCharacter: jest.fn(),
      deleteCharacter: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        {
          provide: CharactersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CharactersController>(CharactersController);
    mockCharactersService = module.get(CharactersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCharacter", () => {
    it("should create a character and return CharacterResponseDto", async () => {
      // Arrange
      const inputCreateCharacterDto: CreateCharacterDto = {
        name: "Luke Skywalker",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      const expectedResponse: CharacterResponseDto = {
        data: mockCharacterData,
      };

      mockCharactersService.createCharacter.mockResolvedValue(
        mockCharacterData,
      );

      // Act
      const actualResult = await controller.createCharacter(
        inputCreateCharacterDto,
      );

      // Assert
      expect(mockCharactersService.createCharacter).toHaveBeenCalledWith(
        inputCreateCharacterDto,
      );
      expect(actualResult).toEqual(expectedResponse);
    });
  });

  describe("getCharacters", () => {
    it("should return characters with default parameters", async () => {
      // Arrange
      const inputQuery: GetCharactersQuery = {};
      const expectedParams: CharactersQueryOptions = {
        page: undefined,
        limit: undefined,
        search: undefined,
        planetId: undefined,
      };

      mockCharactersService.findCharacters.mockResolvedValue(
        mockCharactersResponse,
      );

      // Act
      const actualResult = await controller.getCharacters(inputQuery);

      // Assert
      expect(mockCharactersService.findCharacters).toHaveBeenCalledWith(
        expectedParams,
      );
      expect(actualResult).toEqual(mockCharactersResponse);
    });

    it("should return characters with pagination parameters", async () => {
      // Arrange
      const inputQuery: GetCharactersQuery = {
        page: "2",
        limit: "5",
      };
      const expectedParams: CharactersQueryOptions = {
        page: 2,
        limit: 5,
        search: undefined,
        planetId: undefined,
      };

      mockCharactersService.findCharacters.mockResolvedValue(
        mockCharactersResponse,
      );

      // Act
      const actualResult = await controller.getCharacters(inputQuery);

      // Assert
      expect(mockCharactersService.findCharacters).toHaveBeenCalledWith(
        expectedParams,
      );
      expect(actualResult).toEqual(mockCharactersResponse);
    });

    it("should return characters with search and planet filter", async () => {
      // Arrange
      const inputQuery: GetCharactersQuery = {
        search: "Luke",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      const expectedParams: CharactersQueryOptions = {
        page: undefined,
        limit: undefined,
        search: "Luke",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };

      mockCharactersService.findCharacters.mockResolvedValue(
        mockCharactersResponse,
      );

      // Act
      const actualResult = await controller.getCharacters(inputQuery);

      // Assert
      expect(mockCharactersService.findCharacters).toHaveBeenCalledWith(
        expectedParams,
      );
      expect(actualResult).toEqual(mockCharactersResponse);
    });

    it("should handle all query parameters together", async () => {
      // Arrange
      const inputQuery: GetCharactersQuery = {
        page: "3",
        limit: "20",
        search: "Skywalker",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      const expectedParams: CharactersQueryOptions = {
        page: 3,
        limit: 20,
        search: "Skywalker",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };

      mockCharactersService.findCharacters.mockResolvedValue(
        mockCharactersResponse,
      );

      // Act
      const actualResult = await controller.getCharacters(inputQuery);

      // Assert
      expect(mockCharactersService.findCharacters).toHaveBeenCalledWith(
        expectedParams,
      );
      expect(actualResult).toEqual(mockCharactersResponse);
    });
  });

  describe("getCharacterById", () => {
    it("should return a character by ID", async () => {
      // Arrange
      const inputId = "550e8400-e29b-41d4-a716-446655440000";
      const expectedResponse: CharacterResponseDto = {
        data: mockCharacterData,
      };

      mockCharactersService.findCharacterById.mockResolvedValue(
        mockCharacterData,
      );

      // Act
      const actualResult = await controller.getCharacterById(inputId);

      // Assert
      expect(mockCharactersService.findCharacterById).toHaveBeenCalledWith(
        inputId,
      );
      expect(actualResult).toEqual(expectedResponse);
    });
  });

  describe("getCharacterWithPlanet", () => {
    it("should return a character with planet information", async () => {
      // Arrange
      const inputId = "550e8400-e29b-41d4-a716-446655440000";
      const expectedResponse: CharacterWithPlanetResponseDto = {
        data: mockCharacterWithPlanet,
      };

      mockCharactersService.findCharacterWithPlanet.mockResolvedValue(
        mockCharacterWithPlanet,
      );

      // Act
      const actualResult = await controller.getCharacterWithPlanet(inputId);

      // Assert
      expect(
        mockCharactersService.findCharacterWithPlanet,
      ).toHaveBeenCalledWith(inputId);
      expect(actualResult).toEqual(expectedResponse);
    });
  });

  describe("updateCharacter", () => {
    it("should update a character and return CharacterResponseDto", async () => {
      // Arrange
      const inputId = "550e8400-e29b-41d4-a716-446655440000";
      const inputUpdateCharacterDto: UpdateCharacterDto = {
        name: "Darth Vader",
        planetId: "550e8400-e29b-41d4-a716-446655440002",
      };
      const mockUpdatedCharacter: CharacterDto = {
        ...mockCharacterData,
        name: "Darth Vader",
        planetId: "550e8400-e29b-41d4-a716-446655440002",
      };
      const expectedResponse: CharacterResponseDto = {
        data: mockUpdatedCharacter,
      };

      mockCharactersService.updateCharacter.mockResolvedValue(
        mockUpdatedCharacter,
      );

      // Act
      const actualResult = await controller.updateCharacter(
        inputId,
        inputUpdateCharacterDto,
      );

      // Assert
      expect(mockCharactersService.updateCharacter).toHaveBeenCalledWith(
        inputId,
        inputUpdateCharacterDto,
      );
      expect(actualResult).toEqual(expectedResponse);
    });

    it("should update a character with partial data", async () => {
      // Arrange
      const inputId = "550e8400-e29b-41d4-a716-446655440000";
      const inputUpdateCharacterDto: UpdateCharacterDto = {
        name: "Anakin Skywalker",
      };
      const mockUpdatedCharacter: CharacterDto = {
        ...mockCharacterData,
        name: "Anakin Skywalker",
      };
      const expectedResponse: CharacterResponseDto = {
        data: mockUpdatedCharacter,
      };

      mockCharactersService.updateCharacter.mockResolvedValue(
        mockUpdatedCharacter,
      );

      // Act
      const actualResult = await controller.updateCharacter(
        inputId,
        inputUpdateCharacterDto,
      );

      // Assert
      expect(mockCharactersService.updateCharacter).toHaveBeenCalledWith(
        inputId,
        inputUpdateCharacterDto,
      );
      expect(actualResult).toEqual(expectedResponse);
    });
  });

  describe("deleteCharacter", () => {
    it("should delete a character successfully", async () => {
      // Arrange
      const inputId = "550e8400-e29b-41d4-a716-446655440000";

      mockCharactersService.deleteCharacter.mockResolvedValue();

      // Act
      const actualResult = await controller.deleteCharacter(inputId);

      // Assert
      expect(mockCharactersService.deleteCharacter).toHaveBeenCalledWith(
        inputId,
      );
      expect(actualResult).toBeUndefined();
    });
  });
});
