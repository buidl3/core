import { ethers } from "ethers";

export class Buidl3Provider extends ethers.providers.WebSocketProvider {}

export function create(): Buidl3Provider {
  const url = process.env.NODE_URL as string;
  return new Buidl3Provider(url);
}
