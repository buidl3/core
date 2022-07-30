import Common, { CommonOpts, Chain, Hardfork } from "@ethereumjs/common";

export interface EthersConfig {
  http?: string;
  fallbackHttp?: string;

  ws?: string;
  fallbackWs?: string;
}

export interface P2PConfig {
  peers?: number;
}

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
