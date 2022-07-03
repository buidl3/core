import type { Buidl3Pool } from "./Connection";
import type { DatabasePool, QueryResult, QueryResultRow } from "slonik";
import { sql } from "slonik";

import { IContract, rehydrate } from "../web3/Contract";

export type Buidl3QueryMethods = {
  init(IContract): Promise<boolean>;
  sync(IContract): Promise<void>;
  getContracts(): Promise<QueryResult<QueryResultRow>>;
};

async function init(contract: IContract) {
  const pool = this as Buidl3Pool;

  const { id = "", address = "" } = contract;

  await pool.query(sql`
    INSERT INTO contracts (ct_id, ct_address)
    VALUES (${id}, ${address})
    ON CONFLICT DO NOTHING
  `);

  await this.sync(contract);

  pool.realtime.notifications.on("ct_rehydrate", (payload) => {
    if (payload?.record?.ct_id !== id) return;
    rehydrate.call(contract, payload?.record);
  });

  return true;
}

async function sync(contract: IContract) {
  const pool = this as DatabasePool;

  const { id = "" } = contract;
  const data = await pool.one(sql`SELECT * FROM contracts WHERE ct_id = ${id}`);

  rehydrate.call(contract, data);
}

async function getContracts() {
  const pool = this as DatabasePool;

  return pool.query(sql`SELECT * FROM contracts`);
}

export { init, sync, getContracts };
