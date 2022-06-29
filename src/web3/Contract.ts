export interface IContract {
  address: string;
  genesis?: number;
}

export class ContractBuilder<Contract extends IContract> {
  contract: Contract;

  constructor(config: Contract) {
    this.contract = { genesis: -1, ...config };
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

export function create(): GenericContractBuilder {
  return new GenericContractBuilder({ address: "" });
}
