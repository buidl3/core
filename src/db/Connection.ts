import type { DatabasePool, DatabasePoolConnection } from "slonik";
import { createPool } from "slonik";

import type { Buidl3QueryMethods } from "./Query";
import * as QueryMethods from "./Query";

type Buidl3Pool = DatabasePool & Buidl3QueryMethods;

let pool: DatabasePool | null = null;

export async function create(): Promise<Buidl3Pool> {
  if (!pool) {
    pool = await createPool(process.env.DB_CONNECT as string);
  }

  return { ...pool, ...(QueryMethods as Buidl3QueryMethods) };
}
