import type { DatabasePool } from "slonik";
import { sql } from "slonik";

export type Buidl3QueryMethods = {
  getContracts(): Promise<any>;
};

async function getContracts() {
  const pool = this as DatabasePool;

  return pool.query(sql`SELECT * FROM contracts`);
}

export { getContracts };
