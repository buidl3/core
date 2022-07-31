import type { IContract } from "./Concepts";

export function rehydrate(data) {
  const contract = this as IContract;

  const { ct_tx_top, ct_ev_top, ct_synced } = data;

  contract.txTop = ct_tx_top;
  contract.evTop = ct_ev_top;
  contract.synced = ct_synced;

  if (contract.onRehydrate) contract.onRehydrate(data);
}

export class ContractBuilder<Contract extends IContract> {
  contract: Partial<Contract> = {};

  constructor(id: string) {
    this.contract.id = id;
    this.contract.synced = false;
  }

  public setAddress(address: string) {
    this.contract.address = address;
    return this;
  }

  public setGenesis(number: number) {
    this.contract.genesis = number;
    return this;
  }

  public build() {
    this.contract.evTop = this.contract.genesis;
    this.contract.txTop = this.contract.genesis;

    return this.contract;
  }
}

export class GenericContractBuilder extends ContractBuilder<IContract> { }
