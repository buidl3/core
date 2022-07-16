import type { IRehydratable } from "../db/Concepts";

export interface Block {
  hash: string;
  parent: string;

  number: number;
  chain: number;

  timestamp?: string;

  raw?: any;
}

export interface IContract extends IRehydratable {
  id?: string;
  address?: string;

  // Internals
  txTop?: number;
  evTop?: number;
}
