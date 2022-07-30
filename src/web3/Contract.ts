import type { IContract } from "./Concepts";

export function rehydrate(data) {
  const contract = this as IContract;

  const { ct_tx_top, ct_ev_top } = data;

  contract.txTop = ct_tx_top;
  contract.evTop = ct_ev_top;

  if (contract.onRehydrate) contract.onRehydrate(data);
}

export class ContractBuilder<Contract extends IContract> {
  contract: Contract;

  constructor(id: string) {
    this.contract.id = id;
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
    return this.contract;
  }
}

export class GenericContractBuilder extends ContractBuilder<IContract> {}

export function create(id): GenericContractBuilder {
  return new GenericContractBuilder(id);
}
