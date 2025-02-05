const { spawnSync } = require("../utils");

spawnSync("node", [
  "node_modules/eslint/bin/eslint.js",
  ".",
  "--quiet",
  "--fix",
]);
