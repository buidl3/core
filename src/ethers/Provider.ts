import { ethers } from "ethers";

export class Buidl3Provider extends ethers.providers.WebSocketProvider {
  constructor(url, network) {
    super(url, network);
  }
}

export function create(url, network?): Buidl3Provider {
  return new Buidl3Provider(url, network);
}
