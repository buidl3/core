import { IRehydratable } from "../db/Concepts";

export interface IContract extends IRehydratable {
  id?: string;
  address?: string;

  // Internals
  txTop?: number;
  evTop?: number;
}

export function rehydrate(data) {
  const contract = this as IContract;

  const { ct_tx_top, ct_ev_top } = data;

  contract.txTop = ct_tx_top;
  contract.evTop = ct_ev_top;

  if (contract.onRehydrate) contract.onRehydrate(data);
}

export class ContractBuilder<Contract extends IContract> {
  contract: Contract;

  constructor(id: string, config: Contract) {
    this.contract = { id, ...config };
  }

  public setAddress(address: string) {
    this.contract.address = address;
    return this;
  }

  public create() {
    return this.contract;
  }
}

export class GenericContractBuilder extends ContractBuilder<IContract> {}

export function create(id): GenericContractBuilder {
  return new GenericContractBuilder(id, {});
}
