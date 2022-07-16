import type { Block } from "./Concepts";

type CleanupFunc = () => void;

export interface Buidl3Provider {
  getLatestBlock(): Promise<Block>;

  watchBlocks(onBlock: (block: Block) => void): CleanupFunc;
}
