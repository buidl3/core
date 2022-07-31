import type { IRehydratable, Extra } from "../db/Concepts";
import type { ethers } from "ethers";

export interface Block {
  hash: string;
  parent: string;

  number: number;
  chain: number;

  timestamp?: string;

  extra?: any;
  raw?: any;
}

export interface Event {
  block: number;
  blockHash: string;

  index: number;
  data: string;

  chain: number;

  extra?: any;
  raw?: any;
}

interface EventFilter extends ethers.providers.Filter {
  transform?: (event: Event) => Extra
}

export interface IContract extends IRehydratable {
  id: string;

  address?: string;
  genesis?: number;

  // Internals
  synced: boolean;
  txTop?: number;
  evTop?: number;

  filters?: Array<EventFilter>;
}
