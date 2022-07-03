import { ethers } from "ethers";

export class Buidl3Provider {
  provider: ethers.providers.WebSocketProvider;

  constructor(url, network) {
    this.provider = new ethers.providers.WebSocketProvider(url, network);
  }

  restore(contract) {}
}

export function create(url, network?): Buidl3Provider {
  return new Buidl3Provider(url, network);
}
