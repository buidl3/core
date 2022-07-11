import type { Buidl3Database } from "./db/Connection";
import type { Buidl3Provider } from "./web3/Provider";
import type { IContract } from "./web3/Concepts";

export class Buidl3 {
  db: Buidl3Database;
  provider: Buidl3Provider;

  constructor(db: Buidl3Database, provider: Buidl3Provider) {
    this.db = db;
    this.provider = provider;
  }
}
