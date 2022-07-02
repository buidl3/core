export interface IContract {
  id?: string;
  address?: string;
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
