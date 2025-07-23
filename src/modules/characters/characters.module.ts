import { Module } from "@nestjs/common";

import { CharactersController } from "./controllers/characters.controller";
import { CharactersRepository } from "./repositories/characters.repository";
import { CharactersService } from "./services/characters.service";

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, CharactersRepository],
  exports: [CharactersService],
})
export class CharactersModule {}
