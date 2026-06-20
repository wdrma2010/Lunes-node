const { spawn } = require("child_process");

// Process manager - runs setup.js which handles everything
const script = "/home/container/setup.js";

function run() {
  const child = spawn("node", [script], { stdio: "inherit" });

  child.on("exit", (code) => {
    console.log(`[MANAGER] setup.js exited (${code}), restarting in 3s...`);
    setTimeout(run, 3000);
  });

  child.on("error", (err) => {
    console.log(`[MANAGER] Error: ${err.message}, restarting in 3s...`);
    setTimeout(run, 3000);
  });
}

run();
