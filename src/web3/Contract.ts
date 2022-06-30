export interface IContract {
  id?: string;
  address?: string;
  genesis?: number;
}

export class ContractBuilder<Contract extends IContract> {
  contract: Contract;

  constructor(id: string, config: Contract) {
    this.contract = { id, genesis: -1, ...config };
  }

  public setAddress(address: string) {
    this.contract.address = address;
    return this;
  }

  public setGenesis(block: number) {
    this.contract.genesis = block;
    return this;
  }

  public create() {
    return this.contract;
  }
}

export class GenericContractBuilder extends ContractBuilder<IContract> {}

export function create(id): GenericContractBuilder {
  return new GenericContractBuilder(id, { address: "" });
}
