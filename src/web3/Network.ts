import Common, { CommonOpts, Chain, Hardfork } from "@ethereumjs/common";

export interface EthersConfig {
  nodeUrl?: string;
  fallbackNodeUrl?: string;
}

export interface P2PConfig {}

type NetworkConfig = CommonOpts & { ethers: EthersConfig; p2p: P2PConfig };

export { Chain, Hardfork };
export class Network extends Common {
  ethers?: EthersConfig;
  p2p?: P2PConfig;

  constructor(config: NetworkConfig) {
    super(config);

    this.ethers = config?.ethers;
    this.p2p = config?.p2p;
  }
}
