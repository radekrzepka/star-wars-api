import type { INestApplication } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import type { Server } from "http";
import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";

import type {
  CharacterResponseDto,
  CharactersResponseDto,
  CharacterWithPlanetResponseDto,
} from "../src/modules/characters/dto/character-response.dto";

import { AppModule } from "../src/app.module";

describe("CharactersController (e2e)", () => {
  let app: INestApplication<Server>;
  let createdCharacterId: string;

  const mockCharacterData = {
    name: "Luke Skywalker Test",
    planetId: null,
  };

  const mockUpdateData = {
    name: "Darth Vader Test",
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe("POST /characters", () => {
    it("should create a new character", async () => {
      const inputCharacterData = mockCharacterData;

      const response = await request(app.getHttpServer())
        .post("/characters")
        .send(inputCharacterData)
        .expect(HttpStatus.CREATED);

      const body = response.body as CharacterResponseDto;
      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
      expect(body.data.name).toBe(inputCharacterData.name);
      expect(body.data.planetId).toBe(inputCharacterData.planetId);
      expect(body.data).toHaveProperty("createdAt");
      expect(body.data).toHaveProperty("updatedAt");

      createdCharacterId = body.data.id;
    });

    it("should return 400 for missing required name field", async () => {
      const invalidCharacterData = {
        planetId: "550e8400-e29b-41d4-a716-446655440001",
      };

      await request(app.getHttpServer())
        .post("/characters")
        .send(invalidCharacterData)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 400 for empty character name", async () => {
      const invalidCharacterData = {
        name: "",
      };

      await request(app.getHttpServer())
        .post("/characters")
        .send(invalidCharacterData)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should return 400 for invalid UUID format in planetId", async () => {
      const invalidCharacterData = {
        name: "Valid Name",
        planetId: "invalid-uuid-format",
      };

      await request(app.getHttpServer())
        .post("/characters")
        .send(invalidCharacterData)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /characters", () => {
    it("should return paginated characters", async () => {
      const response = await request(app.getHttpServer())
        .get("/characters")
        .expect(HttpStatus.OK);

      const body = response.body as CharactersResponseDto;
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("pagination");
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.pagination).toHaveProperty("page");
      expect(body.pagination).toHaveProperty("limit");
      expect(body.pagination).toHaveProperty("total");
      expect(body.pagination).toHaveProperty("totalPages");
    });

    it("should return characters with custom pagination", async () => {
      const queryParams = {
        page: 1,
        limit: 5,
      };

      const response = await request(app.getHttpServer())
        .get("/characters")
        .query(queryParams)
        .expect(HttpStatus.OK);

      const body = response.body as CharactersResponseDto;
      expect(body.pagination.page).toBe(queryParams.page);
      expect(body.pagination.limit).toBe(queryParams.limit);
    });

    it("should search characters by name", async () => {
      const searchQuery = {
        search: "Test",
      };

      const response = await request(app.getHttpServer())
        .get("/characters")
        .query(searchQuery)
        .expect(HttpStatus.OK);

      const body = response.body as CharactersResponseDto;
      expect(body).toHaveProperty("data");
      expect(body).toHaveProperty("pagination");
    });
  });

  describe("GET /characters/:id", () => {
    it("should return a character by ID", async () => {
      const characterId = createdCharacterId;

      const response = await request(app.getHttpServer())
        .get(`/characters/${characterId}`)
        .expect(HttpStatus.OK);

      const body = response.body as CharacterResponseDto;
      expect(body).toHaveProperty("data");
      expect(body.data.id).toBe(characterId);
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("planetId");
      expect(body.data).toHaveProperty("createdAt");
      expect(body.data).toHaveProperty("updatedAt");
    });

    it("should return 404 for non-existent character", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

      await request(app.getHttpServer())
        .get(`/characters/${nonExistentId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 400 for invalid UUID format", async () => {
      const invalidId = "invalid-uuid";

      await request(app.getHttpServer())
        .get(`/characters/${invalidId}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe("GET /characters/:id/with-planet", () => {
    it("should return a character with planet information", async () => {
      const characterId = createdCharacterId;

      const response = await request(app.getHttpServer())
        .get(`/characters/${characterId}/with-planet`)
        .expect(HttpStatus.OK);

      const body = response.body as CharacterWithPlanetResponseDto;
      expect(body).toHaveProperty("data");
      expect(body.data.id).toBe(characterId);
      expect(body.data).toHaveProperty("planet");
    });

    it("should return 404 for non-existent character", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

      await request(app.getHttpServer())
        .get(`/characters/${nonExistentId}/with-planet`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe("PATCH /characters/:id", () => {
    it("should update a character", async () => {
      const characterId = createdCharacterId;
      const updateData = mockUpdateData;

      const response = await request(app.getHttpServer())
        .patch(`/characters/${characterId}`)
        .send(updateData)
        .expect(HttpStatus.OK);

      const body = response.body as CharacterResponseDto;
      expect(body).toHaveProperty("data");
      expect(body.data.id).toBe(characterId);
      expect(body.data.name).toBe(updateData.name);
      expect(body.data).toHaveProperty("updatedAt");
    });

    it("should return 404 for non-existent character", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";
      const updateData = mockUpdateData;

      await request(app.getHttpServer())
        .patch(`/characters/${nonExistentId}`)
        .send(updateData)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 400 for invalid update data", async () => {
      const characterId = createdCharacterId;
      const invalidUpdateData = {
        name: "",
      };

      await request(app.getHttpServer())
        .patch(`/characters/${characterId}`)
        .send(invalidUpdateData)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it("should update only specified fields", async () => {
      const characterId = createdCharacterId;
      const partialUpdateData = {
        name: "Updated Character Name",
      };

      const response = await request(app.getHttpServer())
        .patch(`/characters/${characterId}`)
        .send(partialUpdateData)
        .expect(HttpStatus.OK);

      const body = response.body as CharacterResponseDto;
      expect(body.data.name).toBe(partialUpdateData.name);
    });
  });

  describe("DELETE /characters/:id", () => {
    it("should delete a character", async () => {
      const characterId = createdCharacterId;

      await request(app.getHttpServer())
        .delete(`/characters/${characterId}`)
        .expect(HttpStatus.NO_CONTENT);

      await request(app.getHttpServer())
        .get(`/characters/${characterId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 404 for non-existent character", async () => {
      const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

      await request(app.getHttpServer())
        .delete(`/characters/${nonExistentId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it("should return 400 for invalid UUID format", async () => {
      const invalidId = "invalid-uuid";

      await request(app.getHttpServer())
        .delete(`/characters/${invalidId}`)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
