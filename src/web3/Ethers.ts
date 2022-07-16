import type { Buidl3Provider } from "./Provider";
import type { Block } from "./Concepts";

import { Network } from "./Network";
import { ethers } from "ethers";

export class EthersProvider implements Buidl3Provider {
  provider: ethers.providers.WebSocketProvider;

  constructor(url: string, network: ethers.providers.Networkish) {
    this.provider = new ethers.providers.WebSocketProvider(url, network);
  }

  async getLatestBlock() {
    const top = await this.provider.getBlockNumber();
    const block = await this.provider.getBlock(top);

    return this.parseBlock(block);
  }

  watchBlocks(onBlock) {
    async function handleBlock(blockNumber) {
      const block = await this.getBlock(blockNumber);
      onBlock(this.parseBlock(block));
    }

    this.provider.on("block", handleBlock);
    return () => {
      this.provider.off("block", handleBlock);
    };
  }

  private parseBlock(block: ethers.providers.Block): Block {
    return {
      hash: block.hash,
      parent: block.parentHash,
      number: block.number,
      chain: this.provider.network.chainId,

      raw: JSON.stringify(block),
    };
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
