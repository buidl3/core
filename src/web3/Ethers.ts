import type { Buidl3Provider } from "./Provider";

import { EthersConfig, Network } from "./Network";
import { ethers } from "ethers";

export class EthersProvider
  extends ethers.providers.WebSocketProvider
  implements Buidl3Provider
{
  constructor(url: string, network: ethers.providers.Networkish) {
    super(url, network);
  }

  watchBlocks(from, onBlock) {
    return () => {};
  }
}

export async function create(networkId: string): Promise<EthersProvider> {
  let network: Network;
  try {
    network = await import(process.cwd() + `/networks/${networkId}.config.js`);
    if (!network) throw "Configuration not found";
  } catch (error) {
    throw "Network configuration " + networkId + ".config.js was not found!";
  }

  const { ethers } = network;
  if (!ethers?.nodeUrl) throw "Provider URL was not provided!";

  return new EthersProvider(
    ethers?.nodeUrl as string,
    network.chainIdBN().toNumber()
  );
}
