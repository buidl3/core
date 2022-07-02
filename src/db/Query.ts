import type { DatabasePool, QueryResult, QueryResultRow } from "slonik";
import { sql } from "slonik";

import type { IContract } from "../web3/Contract";

export type Buidl3QueryMethods = {
  init(IContract): Promise<QueryResult<QueryResultRow>>;
  getContracts(): Promise<QueryResult<QueryResultRow>>;
};

async function init(contract: IContract) {
  const pool = this as DatabasePool;

  const { id = "", address = "" } = contract;

  return pool.query(sql`
    INSERT INTO contracts (ct_id, ct_address)
    VALUES (${id}, ${address})
  `);
}

async function getContracts() {
  const pool = this as DatabasePool;

  return pool.query(sql`SELECT * FROM contracts`);
}

export { init, getContracts };
