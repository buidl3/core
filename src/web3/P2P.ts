import type { Buidl3Provider } from "./Provider";

import { Network } from "./Network";

import { Block, BlockHeader } from "@ethereumjs/block";
import Common from "@ethereumjs/common";
import {
  DPT,
  RLPx,
  ETH,
  Peer as _Peer,
  int2buffer,
  buffer2int,
} from "@ethereumjs/devp2p";

import { randomBytes } from "crypto";
import { EventEmitter } from "stream";

type Peer = _Peer & { peerId: number };

const PRIVATE_KEY = randomBytes(32);

export class P2PProvider implements Buidl3Provider {
  dpt: DPT;
  rlpx: RLPx;
  network: Common;

  events: EventEmitter;
  peers: Map<number, Peer>;

  constructor(network: Common) {
    this.network = network;
    this.events = new EventEmitter();

    this.dpt = new DPT(PRIVATE_KEY, {
      refreshInterval: 30000,
      endpoint: {
        address: "0.0.0.0",
        udpPort: null,
        tcpPort: null,
      },
    });

    this.rlpx = new RLPx(PRIVATE_KEY, {
      dpt: this.dpt,
      maxPeers: 10,
      capabilities: [ETH.eth66],
      common: this.network,
      remoteClientIdFilter: REMOTE_CLIENTID_FILTER,
    });

    this.dpt.on("error", (err) => {});
    this.rlpx.on("error", (err) => {});

    const genesis = this.network.genesis();

    const current = { peerId: 0 };
    this.peers = new Map<number, Peer>();

    this.rlpx.on("peer:added", (peer: Peer) => {
      peer.peerId = current.peerId++;

      const protocol = peer.getProtocols()[0];

      protocol.sendStatus({
        td: int2buffer(genesis.difficulty),
        bestHash: Buffer.from(genesis.hash.substring(2), "hex"),
        genesisHash: Buffer.from(genesis.hash.substring(2), "hex"),
      } as any);

      protocol.once("status", (status) => {
        this.peers.set(peer.peerId, peer);
        this.events.emit("peer:added", peer);
      });
    });

    this.rlpx.on("peer:removed", (peer: Peer) => {
      this.peers.delete(peer.peerId);
    });

    this.bootstrap();

    setInterval(() => {
      const peersCount = this.dpt.getPeers().length;
      if (peersCount <= 0) this.bootstrap();

      console.log(`Total nodes in DPT: ${peersCount}`);
    }, 5000);
  }

  private bootstrap() {
    const nodes = this.network.bootstrapNodes();
    const BOOTNODES = nodes.map((node) => {
      return {
        address: node.ip,
        udpPort: node.port,
        tcpPort: node.port,
      };
    });

    BOOTNODES.push({
      address: "65.108.70.101",
      udpPort: 30303,
      tcpPort: 30303,
    });

    BOOTNODES.push({
      address: "157.90.35.166",
      udpPort: 30303,
      tcpPort: 30303,
    });

    for (const node of BOOTNODES)
      this.dpt.bootstrap(node as any).catch((err) => {});
  }

  public watchBlocks(from, onBlock) {
    const common = this.network;
    const current = {
      block: from,
      parent: Buffer.from(
        "d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3"
      ),
    };

    function requestNextBlock(protocol) {
      if (!protocol.index) protocol.index = 1;

      protocol.sendMessage(ETH.MESSAGE_CODES.GET_BLOCK_HEADERS, [
        Buffer.from([++protocol.index]),
        [
          int2buffer(current.block),
          Buffer.from([1]),
          Buffer.from([]),
          Buffer.from([1]),
        ],
      ]);
    }

    async function onMessage(protocol, code, payload) {
      if (code > 4) return;

      switch (code) {
        case ETH.MESSAGE_CODES.GET_BLOCK_HEADERS: {
          const headers = [];

          protocol.sendMessage(ETH.MESSAGE_CODES.BLOCK_HEADERS, [
            payload[0],
            headers,
          ]);
          break;
        }

        case ETH.MESSAGE_CODES.BLOCK_HEADERS: {
          if (payload[1].length > 1) break; // More than one block

          try {
            const header = BlockHeader.fromValuesArray(payload[1][0], {
              common,
            });

            if (Buffer.compare(header.parentHash, current.parent) == 0) {
              current.parent = header.hash();
              ++current.block;
            }

            onBlock(header);

            requestNextBlock(protocol);
          } catch (error) {}

          break;
        }
      }
    }

    const $onMessage = curry(onMessage);
    function handlePeer(peer) {
      const protocol = (peer as Peer).getProtocols()[0];
      protocol.on("message", $onMessage(protocol));
      requestNextBlock(protocol);
    }

    for (const peer of this.peers) handlePeer(peer);
    this.events.on("peer:added", handlePeer);

    return () => {
      this.events.removeListener("peer:added", handlePeer);
    };
  }
}

const REMOTE_CLIENTID_FILTER = [
  "go1.5",
  "go1.6",
  "go1.7",
  "Geth/v1.7",
  "quorum",
  "pirl",
  "ubiq",
  "gmc",
  "gwhale",
  "prichain",
];

function curry(f) {
  return function (a) {
    return function (b, c) {
      return f(a, b, c);
    };
  };
}

function isValidTx(tx) {
  return tx.validate();
}

async function isValidBlock(block) {
  return (
    block.validateUnclesHash() &&
    block.transactions.every(isValidTx) &&
    block.validateTransactionsTrie()
  );
}

export async function create(networkId: string): Promise<P2PProvider> {
  let network: Network;
  try {
    network = await import(process.cwd() + `/networks/${networkId}.config.js`);
    if (!network) throw "Configuration not found";
  } catch (error) {
    throw "Network configuration " + networkId + ".config.js was not found!";
  }

  return new P2PProvider(network as Common);
}
