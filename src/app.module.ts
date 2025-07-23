import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CharactersModule } from "./modules/characters/characters.module";
import { DatabaseModule } from "./modules/database/database.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    DatabaseModule,
    CharactersModule,
  ],
})
export class AppModule {}
