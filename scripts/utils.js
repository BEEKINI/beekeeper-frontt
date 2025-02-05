const cp = require("child_process");

exports.spawnSync = (command, args, options = {}) => {
  let status = cp.spawnSync(command, args, {
    stdio: "inherit",
    ...options,
  }).status;
  if (status !== 0) {
    process.exit(status);
  }
};
