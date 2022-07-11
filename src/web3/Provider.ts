type CleanupFunc = () => void;

export interface Buidl3Provider {
  watchBlocks(from: number, onBlock: () => any): CleanupFunc;
}
