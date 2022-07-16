import type { Block } from "./Concepts";

type CleanupFunc = () => void;
type BlockCallback = (Block) => void;

export interface Buidl3Provider {
  getChain(): number;

  getLatestBlock(): Promise<Block>;
  getBlock(from: number): Promise<Block>;
  getBlocks(
    from: number,
    to: number,
    onBlock?: BlockCallback
  ): Promise<Array<Block>>;
  watchBlocks(onBlock: BlockCallback): CleanupFunc;
}
