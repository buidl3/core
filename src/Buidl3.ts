import type { Buidl3Database } from "./db/Connection";
import type { Buidl3Provider, CleanupFunc, EventCallback } from "./web3/Provider";
import type { IContract } from "./web3/Concepts";

import { sql } from "slonik";

export class Buidl3 {
  db: Buidl3Database;
  provider: Buidl3Provider;

  constructor(db: Buidl3Database, provider: Buidl3Provider) {
    this.db = db;
    this.provider = provider;
  }

  async restoreEvents(contract: IContract) {
    if (!contract.filters) return;

    const top = await this.provider.getLatestBlock();

    for (const filter of contract.filters) {
      const events = await this.provider.getEvents(
        filter,
        contract.evTop as number,
        top.number
      );

      for (const event of events) {
        const extra = filter.transform ? filter.transform(event) : undefined;
        await this.db.putEvent(event, extra);
      }
    }
  }

  watchEvents(contract: IContract, onEvent: EventCallback, upsert: boolean = false): CleanupFunc {
    if (!contract.filters) return () => { };

    const listeners: Array<CleanupFunc> = [];

    for (const filter of contract.filters) {
      const unsubscribe = this.provider.watchEvents(filter, event => {
        const extra = filter.transform ? filter.transform(event) : undefined;
        event.extra = extra;

        onEvent(event);

        if (upsert) this.db.putEvent(event, extra);
      });

      listeners.push(unsubscribe);
    }

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    }
  }
}
