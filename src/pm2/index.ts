import "colors";
import * as glob from "glob";

const current = { modules: null as Array<string> | null };
function getModules(path = "modules/*") {
  if (!current.modules) current.modules = glob.sync(path);
  return current.modules as Array<string>;
}

function env() {
  const vars: any = {};

  for (const app of getModules()) {
    const { parsed = null } = require("dotenv").config({ path: app + "/.env" });
    vars[app] = parsed ? parsed : {};
  }

  return {
    __BUIDL3_ENV: Buffer.from(JSON.stringify(vars), "utf8").toString("base64"),
  };
}

function parseENV(data) {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8") || "{}");
}

function appify(app) {
  const env_dev = require("dotenv").config({ path: app + "/.env" });
  const env_production = parseENV(process.env.__BUIDL3_ENV || "")[app] || {};

  const script = glob.sync(app + "/index*")[0];
  if (!!!script) {
    console.error(
      "[BUIDL3][ERROR]".red + " Error: Entrypoint not found for " + app
    );
    process.exit(2);
  }

  return {
    name: app,
    script,
    autorestart: false,
    env: env_dev.parsed || {},
    env_production,
  };
}

export default { getModules, appify, env };
