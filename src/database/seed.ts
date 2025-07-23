import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { characterEpisodes, characters, episodes, planets } from "./schema";

dotenv.config();

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);

const starWarsPlanets = [
  { name: "Tatooine" },
  { name: "Alderaan" },
  { name: "Coruscant" },
  { name: "Hoth" },
  { name: "Endor" },
  { name: "Naboo" },
  { name: "Kamino" },
  { name: "Geonosis" },
  { name: "Mustafar" },
  { name: "Dagobah" },
];

const starWarsEpisodes = [
  {
    name: "The Phantom Menace",
    code: "PHANTOM",
    releaseDate: "1999-05-19",
  },
  {
    name: "Attack of the Clones",
    code: "CLONES",
    releaseDate: "2002-05-16",
  },
  {
    name: "Revenge of the Sith",
    code: "SITH",
    releaseDate: "2005-05-19",
  },
  {
    name: "A New Hope",
    code: "NEWHOPE",
    releaseDate: "1977-05-25",
  },
  {
    name: "The Empire Strikes Back",
    code: "EMPIRE",
    releaseDate: "1980-05-21",
  },
  {
    name: "Return of the Jedi",
    code: "JEDI",
    releaseDate: "1983-05-25",
  },
  {
    name: "The Force Awakens",
    code: "AWAKENS",
    releaseDate: "2015-12-18",
  },
  {
    name: "The Last Jedi",
    code: "LASTJEDI",
    releaseDate: "2017-12-15",
  },
  {
    name: "The Rise of Skywalker",
    code: "SKYWALKER",
    releaseDate: "2019-12-20",
  },
];

async function seed(): Promise<void> {
  try {
    console.log("Starting database seed...");

    console.log("Clearing existing data...");
    await db.delete(characterEpisodes);
    await db.delete(characters);
    await db.delete(planets);
    await db.delete(episodes);

    console.log("Seeding planets...");
    const insertedPlanets = await db
      .insert(planets)
      .values(starWarsPlanets)
      .returning();
    console.log(`Inserted ${insertedPlanets.length} planets`);

    console.log("Seeding episodes...");
    const insertedEpisodes = await db
      .insert(episodes)
      .values(starWarsEpisodes)
      .returning();
    console.log(`Inserted ${insertedEpisodes.length} episodes`);

    const planetLookup = insertedPlanets.reduce(
      (acc, planet) => {
        acc[planet.name] = planet.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    const episodeLookup = insertedEpisodes.reduce(
      (acc, episode) => {
        acc[episode.code] = episode.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    console.log("Seeding characters...");
    const starWarsCharacters = [
      {
        name: "Luke Skywalker",
        planetId: planetLookup["Tatooine"],
      },
      {
        name: "Darth Vader",
        planetId: planetLookup["Tatooine"],
      },
      {
        name: "Han Solo",
        planetId: planetLookup["Corellia"],
      },
      {
        name: "Leia Organa",
        planetId: planetLookup["Alderaan"],
      },
      {
        name: "Wilhuff Tarkin",
        planetId: null,
      },
      {
        name: "C-3PO",
        planetId: planetLookup["Tatooine"],
      },
      {
        name: "R2-D2",
        planetId: planetLookup["Naboo"],
      },
      {
        name: "Obi-Wan Kenobi",
        planetId: planetLookup["Coruscant"],
      },
      {
        name: "Padmé Amidala",
        planetId: planetLookup["Naboo"],
      },
      {
        name: "Anakin Skywalker",
        planetId: planetLookup["Tatooine"],
      },
    ];

    const insertedCharacters = await db
      .insert(characters)
      .values(starWarsCharacters)
      .returning();
    console.log(`Inserted ${insertedCharacters.length} characters`);

    const characterLookup = insertedCharacters.reduce(
      (acc, character) => {
        acc[character.name] = character.id;
        return acc;
      },
      {} as Record<string, string>,
    );

    console.log("Creating character-episode relationships...");
    const characterEpisodeData = [
      {
        characterId: characterLookup["Luke Skywalker"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["Luke Skywalker"],
        episodeId: episodeLookup["EMPIRE"],
      },
      {
        characterId: characterLookup["Luke Skywalker"],
        episodeId: episodeLookup["JEDI"],
      },
      {
        characterId: characterLookup["Darth Vader"],
        episodeId: episodeLookup["SITH"],
      },
      {
        characterId: characterLookup["Darth Vader"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["Darth Vader"],
        episodeId: episodeLookup["EMPIRE"],
      },
      {
        characterId: characterLookup["Darth Vader"],
        episodeId: episodeLookup["JEDI"],
      },
      {
        characterId: characterLookup["Han Solo"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["Han Solo"],
        episodeId: episodeLookup["EMPIRE"],
      },
      {
        characterId: characterLookup["Han Solo"],
        episodeId: episodeLookup["JEDI"],
      },
      {
        characterId: characterLookup["Leia Organa"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["Leia Organa"],
        episodeId: episodeLookup["EMPIRE"],
      },
      {
        characterId: characterLookup["Leia Organa"],
        episodeId: episodeLookup["JEDI"],
      },
      {
        characterId: characterLookup["Wilhuff Tarkin"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["C-3PO"],
        episodeId: episodeLookup["PHANTOM"],
      },
      {
        characterId: characterLookup["C-3PO"],
        episodeId: episodeLookup["CLONES"],
      },
      {
        characterId: characterLookup["C-3PO"],
        episodeId: episodeLookup["SITH"],
      },
      {
        characterId: characterLookup["C-3PO"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["C-3PO"],
        episodeId: episodeLookup["EMPIRE"],
      },
      {
        characterId: characterLookup["C-3PO"],
        episodeId: episodeLookup["JEDI"],
      },

      // R2-D2
      {
        characterId: characterLookup["R2-D2"],
        episodeId: episodeLookup["PHANTOM"],
      },
      {
        characterId: characterLookup["R2-D2"],
        episodeId: episodeLookup["CLONES"],
      },
      {
        characterId: characterLookup["R2-D2"],
        episodeId: episodeLookup["SITH"],
      },
      {
        characterId: characterLookup["R2-D2"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["R2-D2"],
        episodeId: episodeLookup["EMPIRE"],
      },
      {
        characterId: characterLookup["R2-D2"],
        episodeId: episodeLookup["JEDI"],
      },
      {
        characterId: characterLookup["Obi-Wan Kenobi"],
        episodeId: episodeLookup["PHANTOM"],
      },
      {
        characterId: characterLookup["Obi-Wan Kenobi"],
        episodeId: episodeLookup["CLONES"],
      },
      {
        characterId: characterLookup["Obi-Wan Kenobi"],
        episodeId: episodeLookup["SITH"],
      },
      {
        characterId: characterLookup["Obi-Wan Kenobi"],
        episodeId: episodeLookup["NEWHOPE"],
      },
      {
        characterId: characterLookup["Padmé Amidala"],
        episodeId: episodeLookup["PHANTOM"],
      },
      {
        characterId: characterLookup["Padmé Amidala"],
        episodeId: episodeLookup["CLONES"],
      },
      {
        characterId: characterLookup["Padmé Amidala"],
        episodeId: episodeLookup["SITH"],
      },
      {
        characterId: characterLookup["Anakin Skywalker"],
        episodeId: episodeLookup["PHANTOM"],
      },
      {
        characterId: characterLookup["Anakin Skywalker"],
        episodeId: episodeLookup["CLONES"],
      },
      {
        characterId: characterLookup["Anakin Skywalker"],
        episodeId: episodeLookup["SITH"],
      },
    ].filter((rel): rel is { characterId: string; episodeId: string } =>
      Boolean(rel.characterId && rel.episodeId),
    );

    if (characterEpisodeData.length > 0) {
      await db.insert(characterEpisodes).values(characterEpisodeData);
    }
    console.log(
      `Created ${characterEpisodeData.length} character-episode relationships`,
    );

    console.log("Database seeded successfully!");
    console.log(`Summary:`);
    console.log(`${insertedPlanets.length} planets`);
    console.log(`${insertedEpisodes.length} episodes`);
    console.log(`${insertedCharacters.length} characters`);
    console.log(
      `${characterEpisodeData.length} character-episode relationships`,
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
