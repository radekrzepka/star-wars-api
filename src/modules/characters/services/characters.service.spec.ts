import type { TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";

import type {
  CharacterDto,
  CharactersResponseDto,
  CharacterWithPlanetDto,
  CreateCharacterDto,
  UpdateCharacterDto,
} from "../dto";
import type { CharactersQueryOptions } from "../types";

import { CharactersRepository } from "../repositories/characters.repository";
import { CharactersService } from "./characters.service";

describe("CharactersService", () => {
  let service: CharactersService;
  let mockCharactersRepository: jest.Mocked<CharactersRepository>;

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

  const mockCharactersArray: ReadonlyArray<CharacterDto> = [
    mockCharacterData,
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Darth Vader",
      planetId: "550e8400-e29b-41d4-a716-446655440001",
      createdAt: new Date("2024-01-01T00:00:00.000Z"),
      updatedAt: new Date("2024-01-01T00:00:00.000Z"),
    },
  ];

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findMany: jest.fn(),
      countTotal: jest.fn(),
      findById: jest.fn(),
      findWithPlanet: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: CharactersRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
    mockCharactersRepository = module.get(CharactersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createCharacter", () => {
    it("should create a character successfully", async () => {
      // Arrange
      const inputCreateCharacterDto: CreateCharacterDto = {
        name: "Luke Skywalker",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      const expectedRepositoryInput = {
        name: inputCreateCharacterDto.name,
        planetId: inputCreateCharacterDto.planetId,
      };
      mockCharactersRepository.create.mockResolvedValue(mockCharacterData);

      // Act
      const actualResult = await service.createCharacter(
        inputCreateCharacterDto,
      );

      // Assert
      expect(mockCharactersRepository.create).toHaveBeenCalledWith(
        expectedRepositoryInput,
      );
      expect(actualResult).toEqual(mockCharacterData);
    });

    it("should create a character with null planetId when not provided", async () => {
      // Arrange
      const inputCreateCharacterDto: CreateCharacterDto = {
        name: "Obi-Wan Kenobi",
      };
      const expectedRepositoryInput = {
        name: inputCreateCharacterDto.name,
        planetId: null,
      };
      mockCharactersRepository.create.mockResolvedValue(mockCharacterData);

      // Act
      const actualResult = await service.createCharacter(
        inputCreateCharacterDto,
      );

      // Assert
      expect(mockCharactersRepository.create).toHaveBeenCalledWith(
        expectedRepositoryInput,
      );
      expect(actualResult).toEqual(mockCharacterData);
    });

    it("should throw an error when character creation fails", async () => {
      // Arrange
      const inputCreateCharacterDto: CreateCharacterDto = {
        name: "Luke Skywalker",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      mockCharactersRepository.create.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.createCharacter(inputCreateCharacterDto),
      ).rejects.toThrow("Failed to create character");
    });
  });

  describe("findCharacters", () => {
    it("should return characters with default pagination", async () => {
      // Arrange
      const inputParams: CharactersQueryOptions = {};
      const expectedOptions: CharactersQueryOptions = {
        page: 1,
        limit: 10,
        search: undefined,
        planetId: undefined,
      };
      const mockTotalCount = 50;
      const expectedResponse: CharactersResponseDto = {
        data: mockCharactersArray,
        pagination: {
          page: 1,
          limit: 10,
          total: mockTotalCount,
          totalPages: 5,
        },
      };

      mockCharactersRepository.findMany.mockResolvedValue(mockCharactersArray);
      mockCharactersRepository.countTotal.mockResolvedValue(mockTotalCount);

      // Act
      const actualResult = await service.findCharacters(inputParams);

      // Assert
      expect(mockCharactersRepository.findMany).toHaveBeenCalledWith(
        expectedOptions,
      );
      expect(mockCharactersRepository.countTotal).toHaveBeenCalledWith({
        search: undefined,
        planetId: undefined,
      });
      expect(actualResult).toEqual(expectedResponse);
    });

    it("should return characters with custom pagination and search", async () => {
      // Arrange
      const inputParams: CharactersQueryOptions = {
        page: 2,
        limit: 5,
        search: "Luke",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      const expectedOptions: CharactersQueryOptions = {
        page: 2,
        limit: 5,
        search: "Luke",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };
      const mockTotalCount = 15;
      const expectedResponse: CharactersResponseDto = {
        data: mockCharactersArray,
        pagination: {
          page: 2,
          limit: 5,
          total: mockTotalCount,
          totalPages: 3,
        },
      };

      mockCharactersRepository.findMany.mockResolvedValue(mockCharactersArray);
      mockCharactersRepository.countTotal.mockResolvedValue(mockTotalCount);

      // Act
      const actualResult = await service.findCharacters(inputParams);

      // Assert
      expect(mockCharactersRepository.findMany).toHaveBeenCalledWith(
        expectedOptions,
      );
      expect(mockCharactersRepository.countTotal).toHaveBeenCalledWith({
        search: "Luke",
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      });
      expect(actualResult).toEqual(expectedResponse);
    });

    it("should limit the maximum items per page to 100", async () => {
      // Arrange
      const inputParams: CharactersQueryOptions = {
        limit: 150,
      };
      const expectedOptions: CharactersQueryOptions = {
        page: 1,
        limit: 100,
        search: undefined,
        planetId: undefined,
      };

      mockCharactersRepository.findMany.mockResolvedValue(mockCharactersArray);
      mockCharactersRepository.countTotal.mockResolvedValue(200);

      // Act
      await service.findCharacters(inputParams);

      // Assert
      expect(mockCharactersRepository.findMany).toHaveBeenCalledWith(
        expectedOptions,
      );
    });
  });

  describe("findCharacterById", () => {
    it("should return a character when found", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      mockCharactersRepository.findById.mockResolvedValue(mockCharacterData);

      // Act
      const actualResult = await service.findCharacterById(inputCharacterId);

      // Assert
      expect(mockCharactersRepository.findById).toHaveBeenCalledWith(
        inputCharacterId,
      );
      expect(actualResult).toEqual(mockCharacterData);
    });

    it("should throw NotFoundException when character not found", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      mockCharactersRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findCharacterById(inputCharacterId)).rejects.toThrow(
        new NotFoundException(
          `Character with ID "${inputCharacterId}" not found`,
        ),
      );
    });
  });

  describe("findCharacterWithPlanet", () => {
    it("should return a character with planet when found", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      mockCharactersRepository.findWithPlanet.mockResolvedValue(
        mockCharacterWithPlanet,
      );

      // Act
      const actualResult =
        await service.findCharacterWithPlanet(inputCharacterId);

      // Assert
      expect(mockCharactersRepository.findWithPlanet).toHaveBeenCalledWith(
        inputCharacterId,
      );
      expect(actualResult).toEqual(mockCharacterWithPlanet);
    });

    it("should throw NotFoundException when character not found", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      mockCharactersRepository.findWithPlanet.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findCharacterWithPlanet(inputCharacterId),
      ).rejects.toThrow(
        new NotFoundException(
          `Character with ID "${inputCharacterId}" not found`,
        ),
      );
    });
  });

  describe("updateCharacter", () => {
    it("should update a character successfully", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      const inputUpdateCharacterDto: UpdateCharacterDto = {
        name: "Darth Vader",
        planetId: "550e8400-e29b-41d4-a716-446655440002",
      };
      const mockUpdatedCharacter: CharacterDto = {
        ...mockCharacterData,
        name: "Darth Vader",
        planetId: "550e8400-e29b-41d4-a716-446655440002",
      };

      mockCharactersRepository.findById.mockResolvedValue(mockCharacterData);
      mockCharactersRepository.update.mockResolvedValue(mockUpdatedCharacter);

      // Act
      const actualResult = await service.updateCharacter(
        inputCharacterId,
        inputUpdateCharacterDto,
      );

      // Assert
      expect(mockCharactersRepository.findById).toHaveBeenCalledWith(
        inputCharacterId,
      );
      expect(mockCharactersRepository.update).toHaveBeenCalledWith(
        inputCharacterId,
        inputUpdateCharacterDto,
      );
      expect(actualResult).toEqual(mockUpdatedCharacter);
    });

    it("should throw NotFoundException when character to update not found", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      const inputUpdateCharacterDto: UpdateCharacterDto = {
        name: "Darth Vader",
      };

      mockCharactersRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateCharacter(inputCharacterId, inputUpdateCharacterDto),
      ).rejects.toThrow(
        new NotFoundException(
          `Character with ID "${inputCharacterId}" not found`,
        ),
      );
    });

    it("should throw an error when character update fails", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";
      const inputUpdateCharacterDto: UpdateCharacterDto = {
        name: "Darth Vader",
      };

      mockCharactersRepository.findById.mockResolvedValue(mockCharacterData);
      mockCharactersRepository.update.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateCharacter(inputCharacterId, inputUpdateCharacterDto),
      ).rejects.toThrow("Failed to update character");
    });
  });

  describe("deleteCharacter", () => {
    it("should delete a character successfully", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";

      mockCharactersRepository.findById.mockResolvedValue(mockCharacterData);
      mockCharactersRepository.delete.mockResolvedValue();

      // Act
      await service.deleteCharacter(inputCharacterId);

      // Assert
      expect(mockCharactersRepository.findById).toHaveBeenCalledWith(
        inputCharacterId,
      );
      expect(mockCharactersRepository.delete).toHaveBeenCalledWith(
        inputCharacterId,
      );
    });

    it("should throw NotFoundException when character to delete not found", async () => {
      // Arrange
      const inputCharacterId = "550e8400-e29b-41d4-a716-446655440000";

      mockCharactersRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteCharacter(inputCharacterId)).rejects.toThrow(
        new NotFoundException(
          `Character with ID "${inputCharacterId}" not found`,
        ),
      );
    });
  });
});
