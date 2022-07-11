import type { Buidl3Database } from "./Connection";
import type { DatabasePool, QueryResult, QueryResultRow } from "slonik";
import { sql } from "slonik";

import type { IContract } from "../web3/Concepts";
import { rehydrate } from "../web3/Contract";

export type Buidl3QueryMethods = {
  attach(IContract): Promise<boolean>;
  sync(IContract): Promise<void>;

  getContracts(): Promise<QueryResult<QueryResultRow>>;
  getBlocks(from: number, to: number): Promise<QueryResult<QueryResultRow>>;
};

async function attach(contract: IContract) {
  const pool = this as Buidl3Database;

  const { id = "", address = "" } = contract;

  await pool.query(sql`
    INSERT INTO contracts (ct_id, ct_address)
    VALUES (${id}, ${address})
    ON CONFLICT DO NOTHING
  `);

  await sync.call(this, contract);

  pool.realtime.notifications.on("ct_rehydrate", (payload) => {
    if (payload?.record?.ct_id !== id) return;
    rehydrate.call(contract, payload?.record);
  });

  return true;
}

async function sync(contract: IContract) {
  const pool = this as Buidl3Database;

  const { id = "" } = contract;
  const data = await pool.one(sql`SELECT * FROM contracts WHERE ct_id = ${id}`);

  rehydrate.call(contract, data);
}

async function getContracts() {
  const pool = this as Buidl3Database;

  return pool.query(sql`SELECT * FROM contracts`);
}

async function getBlocks(from: number, to: number = Number.MAX_SAFE_INTEGER) {
  const pool = this as Buidl3Database;

  return pool.query(
    sql`SELECT * FROM blocks WHERE bl_number >= ${from} AND bl_number <= ${to}`
  );
}

export { attach, sync, getContracts, getBlocks };
