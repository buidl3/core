function decode(data = "") {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8") || "{}");
}

export function getNetworkEnv(): Object {
  if (typeof process.env.__BUIDL3_NETWORK === "undefined")
    throw "__BUIDL3_NETWORK was not set";

  return decode(process.env.__BUIDL3_NETWORK);
}

export * from "./web3/Network";
