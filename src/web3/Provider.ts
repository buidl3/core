import { ethers } from "ethers";

export function create(url) {
  return new ethers.providers.WebSocketProvider(url);
}
