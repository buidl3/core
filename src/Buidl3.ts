import type { Buidl3Database } from "./db/Connection";
import * as DB from "./db/Connection";

import type { Buidl3Provider } from "./web3/Provider";
import * as Provider from "./web3/Provider";

import { IContract } from "./web3/Contract";

export class Buidl3 {
  db: Buidl3Database;
  provider: Buidl3Provider;

  top: number;

  constructor(db: Buidl3Database, provider: Buidl3Provider) {
    this.db = db;
    this.provider = provider;
  }

  async init() {
    if (this.top) return;
    this.top = await this.provider.getBlockNumber();
  }
}

export async function create() {
  const db = await DB.create();
  const provider = await Provider.create();

  return new Buidl3(db, provider);
}
