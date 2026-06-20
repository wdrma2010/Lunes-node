const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ============================================================
// Configuration - Users only need to modify these values
// ============================================================
const UUID = "YOUR_UUID";                    // Generate: cat /proc/sys/kernel/random/uuid
const DOMAIN = "YOUR_DOMAIN.lunes.host";     // Your Lunes node domain
const PORT = 3134;                           // Your Lunes allocated port
const HY2_PASSWORD = "YOUR_PASSWORD";        // Hysteria2 password

// ============================================================
// Paths
// ============================================================
const XRAY = "/home/container/xy/xy";
const HY2 = "/home/container/h2/h2";
const KEYS_FILE = "/home/container/keys.json";
const XRAY_CONFIG = "/home/container/xy/config.json";
const HY2_CONFIG = "/home/container/h2/config.yaml";
const NODE_INFO = "/home/container/node.txt";

// ============================================================
// Key Management - Fixed after first generation
// ============================================================
function loadOrCreateKeys() {
  if (fs.existsSync(KEYS_FILE)) {
    const keys = JSON.parse(fs.readFileSync(KEYS_FILE, "utf8"));
    console.log("[SETUP] Loaded existing keys from keys.json");
    return keys;
  }

  console.log("[SETUP] Generating NEW REALITY keys...");
  const output = execSync(XRAY + " x25519").toString();
  const privateKey = output.match(/Private key: (.+)/)[1].trim();
  const publicKey = output.match(/Public key: (.+)/)[1].trim();
  const shortId = crypto.randomBytes(4).toString("hex");

  const keys = { privateKey, publicKey, shortId };
  fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
  console.log("[SETUP] Keys saved to keys.json (will persist across restarts)");
  return keys;
}

// ============================================================
// Generate Xray Config
// ============================================================
function generateXrayConfig(keys) {
  const config = {
    log: { loglevel: "none" },
    inbounds: [{
      port: PORT,
      protocol: "vless",
      settings: {
        clients: [{
          id: UUID,
          flow: "xtls-rprx-vision"
        }],
        decryption: "none"
      },
      streamSettings: {
        network: "tcp",
        security: "reality",
        realitySettings: {
          show: false,
          dest: "dl.google.com:443",
          serverNames: ["dl.google.com", "www.google.com"],
          privateKey: keys.privateKey,
          shortIds: [keys.shortId]
        }
      },
      sniffing: {
        enabled: true,
        destOverride: ["http", "tls"]
      }
    }],
    outbounds: [{
      protocol: "freedom",
      tag: "direct"
    }]
  };

  fs.writeFileSync(XRAY_CONFIG, JSON.stringify(config, null, 2));
  console.log("[SETUP] Xray config written");
}

// ============================================================
// Generate Hysteria2 Config
// ============================================================
function generateHy2Config() {
  const config = `listen: :${PORT}

tls:
  cert: /home/container/h2/cert.pem
  key: /home/container/h2/key.pem

auth:
  type: password
  password: "${HY2_PASSWORD}"

quic:
  initStreamReceiveWindow: 4194304
  maxStreamReceiveWindow: 4194304
  initConnReceiveWindow: 10485760
  maxConnReceiveWindow: 10485760
  maxIdleTimeout: 30s
  keepAlivePeriod: 10s

bandwidth:
  up: 0
  down: 0

ignoreClientBandwidth: true
udpIdleTimeout: 60s
`;

  fs.writeFileSync(HY2_CONFIG, config);
  console.log("[SETUP] Hysteria2 config written");
}

// ============================================================
// Generate Connection URLs
// ============================================================
function generateNodeInfo(keys) {
  const sni = "dl.google.com";
  const fp = "chrome";
  const vlessParams = `encryption=none&flow=xtls-rprx-vision&security=reality&sni=${sni}&fp=${fp}&pbk=${keys.publicKey}&sid=${keys.shortId}&spx=%2F&type=tcp&headerType=none`;

  const vlessUrl = `vless://${UUID}@${DOMAIN}:${PORT}?${vlessParams}#Lunes-Reality`;

  const encodedPwd = encodeURIComponent(HY2_PASSWORD);
  const hy2Url = `hysteria2://${encodedPwd}@${DOMAIN}:${PORT}?insecure=1&sni=${DOMAIN}#Lunes-HY2`;

  const info = [
    "============================================================",
    "  Lunes Node - Connection Info",
    "============================================================",
    "",
    "VLESS + Reality (recommended):",
    vlessUrl,
    "",
    "Hysteria2:",
    hy2Url,
    "",
    "============================================================",
    "  UUID:      " + UUID,
    "  Public Key: " + keys.publicKey,
    "  Short ID:  " + keys.shortId,
    "  Port:      " + PORT,
    "============================================================"
  ].join("\n");

  fs.writeFileSync(NODE_INFO, info);
  console.log("[SETUP] Node info saved to node.txt");

  return { vlessUrl, hy2Url };
}

// ============================================================
// Generate TLS Certificate for Hysteria2
// ============================================================
function generateCert() {
  const certPath = "/home/container/h2/cert.pem";
  const keyPath = "/home/container/h2/key.pem";

  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log("[SETUP] TLS certificate already exists");
    return;
  }

  console.log("[SETUP] Generating TLS certificate...");
  execSync(`openssl req -x509 -newkey rsa:2048 -days 3650 -nodes -keyout ${keyPath} -out ${certPath} -subj "/CN=${DOMAIN}" 2>/dev/null`);
  console.log("[SETUP] TLS certificate generated");
}

// ============================================================
// Process Manager with Auto-Restart
// ============================================================
function keepAlive(name, cmd, args) {
  const p = spawn(cmd, args, { stdio: "inherit" });
  console.log(`[SETUP] ${name} started (PID: ${p.pid})`);

  p.on("exit", (code) => {
    console.log(`[MANAGER] ${name} exited (${code}), restarting in 3s...`);
    setTimeout(() => keepAlive(name, cmd, args), 3000);
  });

  p.on("error", (err) => {
    console.log(`[MANAGER] ${name} error: ${err.message}, restarting in 3s...`);
    setTimeout(() => keepAlive(name, cmd, args), 3000);
  });
}

// ============================================================
// Main
// ============================================================
function main() {
  console.log("============================================================");
  console.log("  Lunes Node Enhanced Installer");
  console.log("============================================================");

  // Validate configuration
  if (UUID === "YOUR_UUID" || DOMAIN === "YOUR_DOMAIN.lunes.host" || HY2_PASSWORD === "YOUR_PASSWORD") {
    console.error("[ERROR] Please edit setup.js and fill in your configuration!");
    console.error("  - UUID: Your VLESS UUID");
    console.error("  - DOMAIN: Your Lunes domain (e.g., node24.lunes.host)");
    console.error("  - PORT: Your Lunes allocated port");
    console.error("  - HY2_PASSWORD: Your Hysteria2 password");
    process.exit(1);
  }

  // Load or generate keys
  const keys = loadOrCreateKeys();
  console.log("[SETUP] Public Key: " + keys.publicKey);
  console.log("[SETUP] Short ID:  " + keys.shortId);

  // Generate configs
  generateXrayConfig(keys);
  generateHy2Config();
  generateCert();

  // Generate connection info
  const { vlessUrl, hy2Url } = generateNodeInfo(keys);

  // Print connection info
  console.log("");
  console.log("============================================================");
  console.log("  Connection URLs");
  console.log("============================================================");
  console.log("");
  console.log("VLESS + Reality:");
  console.log(vlessUrl);
  console.log("");
  console.log("Hysteria2:");
  console.log(hy2Url);
  console.log("");
  console.log("============================================================");

  // Start services
  console.log("");
  console.log("[SETUP] Starting services...");
  keepAlive("Xray", XRAY, ["-c", XRAY_CONFIG]);
  keepAlive("Hysteria2", HY2, ["server", "-c", HY2_CONFIG]);
  console.log("[SETUP] All services started!");
}

main();
