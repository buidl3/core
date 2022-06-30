export {
  IContract,
  ContractBuilder,
  GenericContractBuilder as Contract,
} from "./web3/Contract";

import * as Provider from "./ethers/Provider";
import * as DB from "./db/Connection";

export { DB, Provider };
