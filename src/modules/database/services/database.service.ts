import type { Pool } from "pg";
import { Inject, Injectable } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

import { CONNECTION_POOL } from "../../../constants";
import * as schema from "../schema";

@Injectable()
export class DatabaseService {
  public client: NodePgDatabase<typeof schema>;

  constructor(@Inject(CONNECTION_POOL) private readonly pool: Pool) {
    this.client = drizzle(this.pool, { schema });
  }
}
