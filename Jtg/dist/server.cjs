"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/services/db.ts
var db_exports = {};
__export(db_exports, {
  readJSON: () => readJSON,
  writeJSON: () => writeJSON
});
var import_fs_extra, import_path, DATA_DIR, readJSON, writeJSON;
var init_db = __esm({
  "src/server/services/db.ts"() {
    "use strict";
    import_fs_extra = __toESM(require("fs-extra"), 1);
    import_path = __toESM(require("path"), 1);
    DATA_DIR = import_path.default.join(process.cwd(), ".data");
    readJSON = async (filename) => {
      const filePath = import_path.default.join(DATA_DIR, filename);
      try {
        return await import_fs_extra.default.readJson(filePath);
      } catch (err) {
        return null;
      }
    };
    writeJSON = async (filename, data) => {
      const filePath = import_path.default.join(DATA_DIR, filename);
      await import_fs_extra.default.writeJson(filePath, data, { spaces: 2 });
    };
  }
});

// server.ts
var server_exports = {};
__export(server_exports, {
  io: () => io
});
module.exports = __toCommonJS(server_exports);
var import_config = require("dotenv/config");
var import_express7 = __toESM(require("express"), 1);
var import_path6 = __toESM(require("path"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_http = require("http");
var import_socket = require("socket.io");
var import_vite = require("vite");
var import_fs_extra5 = __toESM(require("fs-extra"), 1);
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"), 1);

// src/server/services/docker.ts
var import_dockerode = __toESM(require("dockerode"), 1);
var import_fs_extra2 = __toESM(require("fs-extra"), 1);
var import_path2 = __toESM(require("path"), 1);
init_db();
var getSocketPath = () => {
  if (process.platform === "win32") return "//./pipe/docker_engine";
  if (process.env.DOCKER_SOCKET_PATH && import_fs_extra2.default.existsSync(process.env.DOCKER_SOCKET_PATH)) {
    return process.env.DOCKER_SOCKET_PATH;
  }
  if (import_fs_extra2.default.existsSync("/var/run/docker.sock")) return "/var/run/docker.sock";
  if (import_fs_extra2.default.existsSync("/run/docker.sock")) return "/run/docker.sock";
  return "/var/run/docker.sock";
};
var isSandbox = !import_fs_extra2.default.existsSync("/var/run/docker.sock") && !import_fs_extra2.default.existsSync("/run/docker.sock") && !(process.env.DOCKER_SOCKET_PATH && import_fs_extra2.default.existsSync(process.env.DOCKER_SOCKET_PATH)) && process.platform !== "win32";
var defaultDocker = new import_dockerode.default({ socketPath: getSocketPath() });
var getDocker = async (nodeId) => {
  if (!nodeId || nodeId === "local") return defaultDocker;
  const nodes = await readJSON("nodes.json") || [];
  const node = nodes.find((n) => n.id === nodeId);
  if (node) {
    let host = node.ip;
    let protocol = "http";
    let port = node.port;
    if (!host.startsWith("http://") && !host.startsWith("https://") && port === 443) {
      protocol = "https";
    }
    if (host.startsWith("http://") || host.startsWith("https://")) {
      try {
        const url = new URL(host);
        protocol = url.protocol.replace(":", "") === "https" ? "https" : "http";
        host = url.hostname;
        if (url.port) port = parseInt(url.port);
        else port = protocol === "https" ? 443 : 80;
      } catch (e) {
        console.error("Invalid URL in node IP", host);
      }
    }
    return new import_dockerode.default({
      protocol,
      host,
      port,
      headers: {
        Authorization: "Bearer " + node.key,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
  }
  return defaultDocker;
};
var mockState = {};
var getVersions = async (type = "PAPER") => {
  const normalizedType = type.toUpperCase();
  if (normalizedType === "VELOCITY") {
    return ["latest", "3.3.0-SNAPSHOT"];
  }
  if (normalizedType === "BUNGEECORD" || normalizedType === "WATERFALL") {
    return ["latest"];
  }
  return [
    "latest",
    "1.21.11",
    "1.21.10",
    "1.21.9",
    "1.21.8",
    "1.21.7",
    "1.21.6",
    "1.21.5",
    "1.21.4",
    "1.21.3",
    "1.21.1",
    "1.21",
    "1.20.6",
    "1.20.5",
    "1.20.4",
    "1.20.2",
    "1.20.1",
    "1.20",
    "1.19.4",
    "1.19.3",
    "1.19.2",
    "1.19.1",
    "1.19",
    "1.18.2",
    "1.18.1",
    "1.18",
    "1.17.1",
    "1.17",
    "1.16.5",
    "1.16.4",
    "1.16.3",
    "1.16.2",
    "1.16.1",
    "1.15.2",
    "1.15.1",
    "1.15",
    "1.14.4",
    "1.14.3",
    "1.14.2",
    "1.14.1",
    "1.14",
    "1.13.2",
    "1.13.1",
    "1.13",
    "1.12.2",
    "1.12.1",
    "1.12",
    "1.11.2",
    "1.10.2",
    "1.9.4",
    "1.8.8",
    "1.7.10"
  ];
};
var createServerContainer = async (serverData, nodeId) => {
  const docker = await getDocker(nodeId || serverData.nodeId);
  if (isSandbox) {
    mockState[serverData.id] = false;
    return "mock-container-id-" + serverData.id;
  }
  const serverType = serverData.type || "PAPER";
  const isProxy = ["VELOCITY", "BUNGEECORD", "WATERFALL"].includes(serverType.toUpperCase());
  const shortImage = isProxy ? "itzg/bungeecord:latest" : "itzg/minecraft-server:latest";
  const fullImage = isProxy ? "docker.io/itzg/bungeecord:latest" : "docker.io/itzg/minecraft-server:latest";
  const findImageId = async () => {
    try {
      const images = await docker.listImages();
      const matched = images.find(
        (img) => img.RepoTags && img.RepoTags.some((tag) => tag.includes(shortImage) || tag.includes(fullImage))
      );
      if (matched) return matched.Id;
    } catch (e) {
      console.warn("Failed to list images:", e);
    }
    return null;
  };
  const pullImageStream = async (imgTag) => {
    console.log(`Pulling image ${imgTag}...`);
    const { exec: exec2 } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec2);
    const engine = "docker";
    try {
      console.log(`Executing: ${engine} pull ${imgTag}`);
      const { stdout, stderr } = await execAsync(`${engine} pull ${imgTag}`);
      console.log(`${engine} pull stdout:`, stdout);
      if (stderr) console.warn(`${engine} pull stderr:`, stderr);
    } catch (cliErr) {
      console.warn(`CLI pull failed for ${imgTag}: ${cliErr}. Trying Docker API fallback...`);
      await new Promise((resolve, reject) => {
        docker.pull(imgTag, (err, stream) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err2, output) => {
            if (err2) return reject(err2);
            resolve(output);
          });
        });
      });
    }
  };
  const ensureImage = async () => {
    let existingId = await findImageId();
    if (existingId) return existingId;
    try {
      await pullImageStream(shortImage);
      let idAfterShort = await findImageId();
      if (idAfterShort) return idAfterShort;
    } catch (e) {
      console.warn(`Failed to pull ${shortImage}...`, e);
    }
    console.warn(`Attempting fallback pull with ${fullImage}...`);
    await pullImageStream(fullImage);
    let idAfterFull = await findImageId();
    if (idAfterFull) return idAfterFull;
    return shortImage;
  };
  const targetImage = await ensureImage();
  const serverDir = import_path2.default.join(process.cwd(), ".data", "servers", serverData.id);
  await import_fs_extra2.default.ensureDir(serverDir);
  const envVars = [
    `TYPE=${serverType}`,
    `VERSION=${serverData.version}`,
    `MEMORY=${serverData.ram}G`,
    `INIT_MEMORY=128M`,
    `SERVER_PORT=${serverData.port}`
  ];
  if (!isProxy) {
    envVars.push(
      `EULA=TRUE`,
      `ENABLE_RCON=true`,
      `RCON_PASSWORD=admin`,
      `JVM_OPTS=-DPaper.IgnoreWorldDataVersion=true`,
      `JVM_DD_OPTS=Paper.IgnoreWorldDataVersion=true,paper.ignoreWorldDataVersion=true`
    );
  }
  const buildContainerOptions = (img) => ({
    Image: img,
    name: `jtg-server-${serverData.id}`,
    Tty: true,
    OpenStdin: true,
    StdinOnce: false,
    Env: envVars,
    ExposedPorts: {
      [`${serverData.port}/tcp`]: {}
    },
    HostConfig: {
      PortBindings: {
        [`${serverData.port}/tcp`]: [
          {
            HostPort: `${serverData.port}`
          }
        ]
      },
      Binds: [`${serverDir}:${isProxy ? "/server" : "/data"}`]
    }
  });
  let container;
  try {
    container = await docker.createContainer(buildContainerOptions(targetImage));
  } catch (err) {
    const errStr = String(err?.message || err);
    if (err?.statusCode === 404 || errStr.includes("404") || errStr.includes("no such image")) {
      const altImage = targetImage === shortImage ? fullImage : shortImage;
      console.log(`404 image error with ${targetImage}. Attempting fallback with ${altImage}...`);
      try {
        await pullImageStream(altImage);
        container = await docker.createContainer(buildContainerOptions(altImage));
      } catch (fallbackErr) {
        console.log(`Pulling ${targetImage} directly and retrying...`);
        await pullImageStream(targetImage);
        container = await docker.createContainer(buildContainerOptions(targetImage));
      }
    } else {
      throw err;
    }
  }
  return container.id;
};
var startContainer = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    const id = containerId.replace("mock-container-id-", "");
    mockState[id] = true;
    try {
      const servers = await readJSON("servers.json") || [];
      const server = servers.find((s) => s.id === id);
      if (server) {
        const serverDir = import_path2.default.join(process.cwd(), ".data", "servers", id);
        await import_fs_extra2.default.ensureDir(serverDir);
        const type = (server.type || "PAPER").toUpperCase();
        if (["VELOCITY", "BUNGEECORD", "WATERFALL"].includes(type)) {
          const configName = type === "VELOCITY" ? "velocity.toml" : "config.yml";
          const configPath = import_path2.default.join(serverDir, configName);
          if (!import_fs_extra2.default.existsSync(configPath)) {
            await import_fs_extra2.default.writeFile(configPath, "# Autogenerated proxy config in sandbox mode\n# Port: " + server.port + "\n");
          }
        } else {
          const propsPath = import_path2.default.join(serverDir, "server.properties");
          if (!import_fs_extra2.default.existsSync(propsPath)) {
            await import_fs_extra2.default.writeFile(propsPath, "server-port=" + server.port + "\nmotd=A Minecraft Server\n");
          }
        }
      }
    } catch (e) {
    }
    io.to(`server_${id}`).emit("log", `[System] Server started (Sandbox Mode).\r
`);
    return;
  }
  const container = docker.getContainer(containerId);
  await container.start();
};
var stopContainer = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    const id = containerId.replace("mock-container-id-", "");
    mockState[id] = false;
    io.to(`server_${id}`).emit("log", `[System] Server stopped (Sandbox Mode).\r
`);
    return;
  }
  const container = docker.getContainer(containerId);
  await container.stop();
};
var restartContainer = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    const id = containerId.replace("mock-container-id-", "");
    mockState[id] = true;
    io.to(`server_${id}`).emit("log", `[System] Server restarted (Sandbox Mode).\r
`);
    return;
  }
  const container = docker.getContainer(containerId);
  await container.restart();
};
var deleteContainer = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    const id = containerId.replace("mock-container-id-", "");
    delete mockState[id];
    return;
  }
  const container = docker.getContainer(containerId);
  try {
    const info = await container.inspect();
    if (info.State.Running) {
      await container.stop();
    }
    await container.remove({ force: true });
  } catch (err) {
    console.error("Error deleting container", err);
  }
};
var getContainerStatus = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    const id = containerId.replace("mock-container-id-", "");
    const isRunning = mockState[id] || false;
    return { State: { Running: isRunning, Status: isRunning ? "running" : "exited" } };
  }
  try {
    const container = docker.getContainer(containerId);
    const info = await container.inspect();
    return info;
  } catch (e) {
    return null;
  }
};
var getContainerStats = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    const id = containerId.replace("mock-container-id-", "");
    if (!mockState[id]) return { cpu: 0, ram: 0, disk: 0 };
    const timeSec = Math.floor(Date.now() / 5e3);
    const floatPseudo = (Math.sin(timeSec + id.charCodeAt(0)) + 1) / 2;
    return {
      cpu: floatPseudo * 10 + 2,
      // 2% to 12%
      ram: 600 + (floatPseudo * 50 - 25),
      // ~600 MB
      disk: 2.1
    };
  }
  try {
    const container = docker.getContainer(containerId);
    const info = await container.inspect();
    if (!info.State.Running) {
      return { cpu: 0, ram: 0, disk: 0 };
    }
    const statsResult = await container.stats({ stream: false });
    let cpuPercent = 0;
    try {
      const cpuDelta = statsResult.cpu_stats.cpu_usage.total_usage - statsResult.precpu_stats.cpu_usage.total_usage;
      const systemDelta = statsResult.cpu_stats.system_cpu_usage - statsResult.precpu_stats.system_cpu_usage;
      if (systemDelta > 0 && cpuDelta > 0) {
        const cpus = statsResult.cpu_stats.online_cpus || statsResult.cpu_stats.cpu_usage.percpu_usage?.length || 1;
        cpuPercent = cpuDelta / systemDelta * cpus * 100;
      }
    } catch (e) {
    }
    let ramMB = 0;
    try {
      const stats = statsResult.memory_stats.stats || {};
      const cache = stats.cache || stats.inactive_file || stats.total_inactive_file || 0;
      const usedMemory = statsResult.memory_stats.usage - cache;
      ramMB = usedMemory / 1024 / 1024;
    } catch (e) {
    }
    return {
      cpu: cpuPercent,
      ram: ramMB,
      disk: 2.1
    };
  } catch (e) {
    return { cpu: 0, ram: 0, disk: 0 };
  }
};
var getContainerLogs = async (containerId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) return "[System] Sandbox mode. No historical logs available.\r\n";
  try {
    const container = docker.getContainer(containerId);
    const logsBuffer = await container.logs({ stdout: true, stderr: true, tail: 100 });
    return logsBuffer.toString("utf8");
  } catch (e) {
    return "";
  }
};
var activeStreams = {};
var attachContainerSocket = async (containerId, serverId, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    return;
  }
  try {
    const container = docker.getContainer(containerId);
    if (!activeStreams[containerId]) {
      const stream = await container.attach({ stream: true, stdout: true, stderr: true, stdin: true });
      activeStreams[containerId] = stream;
      stream.on("data", (chunk) => {
        io.to(`server_${serverId}`).emit("log", chunk.toString());
      });
      stream.on("end", () => {
        delete activeStreams[containerId];
      });
    }
  } catch (e) {
    console.error("Attach error", e);
  }
};
var sendContainerCommand = async (containerId, command, nodeId) => {
  const docker = await getDocker(nodeId);
  if (isSandbox) {
    return;
  }
  if (activeStreams[containerId]) {
    activeStreams[containerId].write(command + "\n");
  } else {
    try {
      const container = docker.getContainer(containerId);
      const stream = await container.attach({ stream: true, stdout: true, stderr: true, stdin: true });
      activeStreams[containerId] = stream;
      stream.write(command + "\n");
      stream.on("data", (chunk) => {
      });
    } catch (e) {
      console.error("Command error", e);
    }
  }
};

// src/server/routes/api.ts
var import_express6 = __toESM(require("express"), 1);
init_db();

// src/server/routes/auth.ts
var import_express = __toESM(require("express"), 1);

// src/server/controllers/auth.ts
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
init_db();
var JWT_SECRET = process.env.JWT_SECRET || "jtg-panel-super-secret";
var register = async (req, res) => {
  const settings = await readJSON("settings.json") || {};
  if (settings.enableRegistration === false) {
    res.status(403).json({ error: "User registration is currently disabled by administrator." });
    return;
  }
  const { username, password, confirmPassword } = req.body;
  if (!username || !password || !confirmPassword) {
    res.status(400).json({ error: "Username, password, and confirm password are required" });
    return;
  }
  const cleanUsername = username.trim();
  if (cleanUsername.length < 3) {
    res.status(400).json({ error: "Username must be at least 3 characters" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ error: "Passwords do not match" });
    return;
  }
  const users = await readJSON("users.json") || [];
  const existingUser = users.find((u) => u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (existingUser) {
    res.status(400).json({ error: "Username is already taken" });
    return;
  }
  const { writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
  const hashedPassword = await import_bcryptjs.default.hash(password, 10);
  const newUser = {
    id: "user-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    username: cleanUsername,
    password: hashedPassword,
    role: "user",
    passwordVersion: 0
  };
  users.push(newUser);
  await writeJSON2("users.json", users);
  res.status(201).json({
    message: "User registered successfully",
    user: { id: newUser.id, username: newUser.username, role: newUser.role }
  });
};
var login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }
  const isDevMode = process.env.NODE_ENV !== "production" || process.env.PORT === "3000" || process.env.PORT !== "6767";
  if (isDevMode) {
    const users2 = await readJSON("users.json") || [];
    let user2 = users2.find((u) => u.username === username);
    if (!user2) {
      const { writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const hashedPassword = await import_bcryptjs.default.hash(password, 10);
      user2 = {
        id: "dev-user-" + Math.random().toString(36).substr(2, 9),
        username,
        password: hashedPassword,
        role: "admin",
        passwordVersion: 0
      };
      users2.push(user2);
      await writeJSON2("users.json", users2);
    }
    const role2 = user2.role || "admin";
    const token2 = import_jsonwebtoken.default.sign(
      { id: user2.id, username: user2.username, role: role2, passwordVersion: user2.passwordVersion || 0 },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token: token2, user: { id: user2.id, username: user2.username, role: role2 } });
    return;
  }
  const users = await readJSON("users.json") || [];
  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const isMatch = await import_bcryptjs.default.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const role = user.role || "admin";
  const token = import_jsonwebtoken.default.sign({ id: user.id, username: user.username, role, passwordVersion: user.passwordVersion || 0 }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, username: user.username, role } });
};
var logout = (req, res) => {
  res.json({ message: "Logged out" });
};
var getMe = async (req, res) => {
  const reqUser = req.user;
  if (reqUser && reqUser.id !== "temp-admin") {
    const users = await readJSON("users.json") || [];
    const dbUser = users.find((u) => u.id === reqUser.id);
    if (dbUser) {
      return res.json({
        user: {
          ...reqUser,
          googleId: dbUser.googleId || null,
          isGoogleUser: !!(dbUser.googleId || !dbUser.password)
        }
      });
    }
  }
  res.json({ user: reqUser });
};
var getUsers = async (req, res) => {
  const users = await readJSON("users.json") || [];
  res.json(users.map((u) => ({ id: u.id, username: u.username, role: u.role, isGoogleUser: !!u.googleId })));
};
var changeUsername = async (req, res) => {
  const reqUser = req.user;
  const { newUsername } = req.body;
  if (!newUsername || typeof newUsername !== "string" || newUsername.trim().length < 3) {
    return res.status(400).json({ error: "Username must be at least 3 characters long." });
  }
  const cleanUsername = newUsername.trim();
  if (reqUser.id === "temp-admin") {
    return res.status(400).json({ error: "Cannot change username of default admin account." });
  }
  const users = await readJSON("users.json") || [];
  const userIndex = users.findIndex((u) => u.id === reqUser.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!users[userIndex].googleId) {
    return res.status(400).json({ error: "Username change is only available for Google authenticated accounts." });
  }
  const existingUser = users.find((u) => u.id !== reqUser.id && u.username && u.username.toLowerCase() === cleanUsername.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: `Username '${cleanUsername}' is already taken.` });
  }
  users[userIndex].username = cleanUsername;
  await writeJSON("users.json", users);
  res.json({ success: true, username: cleanUsername });
};
var changePassword = async (req, res) => {
  const reqUser = req.user;
  const { oldPassword, newPassword } = req.body;
  if (reqUser.id === "temp-admin") {
    return res.status(400).json({ error: "Cannot change password of default admin account. Create a new admin user instead." });
  }
  const users = await readJSON("users.json") || [];
  const userIndex = users.findIndex((u) => u.id === reqUser.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  if (users[userIndex].googleId || !users[userIndex].password) {
    return res.status(400).json({ error: "Password change is disabled for Google Auth accounts." });
  }
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "New password must be at least 8 characters" });
  }
  const isMatch = await import_bcryptjs.default.compare(oldPassword || "", users[userIndex].password);
  if (!isMatch) {
    return res.status(401).json({ error: "Incorrect old password" });
  }
  const { writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
  const hashedPassword = await import_bcryptjs.default.hash(newPassword, 10);
  users[userIndex].password = hashedPassword;
  users[userIndex].passwordVersion = (users[userIndex].passwordVersion || 0) + 1;
  await writeJSON2("users.json", users);
  res.json({ success: true });
};
var googleLogin = async (req, res) => {
  const { email, googleId, name, photoURL } = req.body;
  if (!email) {
    res.status(400).json({ error: "Google email is required" });
    return;
  }
  const settings = await readJSON("settings.json") || {};
  if (settings.enableGoogleLogin === false) {
    res.status(403).json({ error: "Google Login is disabled on this panel." });
    return;
  }
  const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9_.]/g, "");
  const baseUsername = emailPrefix || "user";
  const users = await readJSON("users.json") || [];
  let user = users.find((u) => u.email && u.email.toLowerCase() === email.toLowerCase() || u.googleId && u.googleId === googleId || u.username && u.username.toLowerCase() === baseUsername.toLowerCase());
  if (!user) {
    const isFirstUser = users.length === 0;
    const role2 = isFirstUser ? "admin" : "user";
    const { writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    user = {
      id: "google-user-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      username: baseUsername,
      email,
      googleId,
      role: role2,
      avatar: photoURL || "",
      passwordVersion: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    users.push(user);
    await writeJSON2("users.json", users);
  } else {
    let updated = false;
    if (!user.email) {
      user.email = email;
      updated = true;
    }
    if (!user.googleId) {
      user.googleId = googleId;
      updated = true;
    }
    if (photoURL && !user.avatar) {
      user.avatar = photoURL;
      updated = true;
    }
    if (updated) {
      const { writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      await writeJSON2("users.json", users);
    }
  }
  const role = user.role || "admin";
  const token = import_jsonwebtoken.default.sign(
    { id: user.id, username: user.username, role, passwordVersion: user.passwordVersion || 0 },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      role,
      email: user.email,
      avatar: user.avatar,
      googleId: user.googleId,
      isGoogleUser: true
    }
  });
};

// src/server/middleware/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var JWT_SECRET2 = process.env.JWT_SECRET || "jtg-panel-super-secret";
var requireAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (token.startsWith("jtg-") || token.startsWith("jtg_")) {
    try {
      const { readJSON: readJSON2, writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const apiKeys = await readJSON2("api_keys.json") || [];
      const keyHash = import_crypto.default.createHash("sha256").update(token).digest("hex");
      const apiKey = apiKeys.find((k) => k.key_hash === keyHash);
      if (!apiKey || apiKey.revoked) {
        res.status(401).json({ error: "Invalid or revoked API key" });
        return;
      }
      if (apiKey.expires_at && new Date(apiKey.expires_at) < /* @__PURE__ */ new Date()) {
        res.status(401).json({ error: "API key expired" });
        return;
      }
      apiKey.last_used_at = (/* @__PURE__ */ new Date()).toISOString();
      await writeJSON2("api_keys.json", apiKeys);
      const users = await readJSON2("users.json") || [];
      let adminRole = "admin";
      if (apiKey.created_by !== "temp-admin") {
        const creator = users.find((u) => u.id === apiKey.created_by);
        if (!creator || creator.role !== "admin" && creator.role !== "owner") {
          res.status(403).json({ error: "Forbidden: API Key creator is no longer an admin" });
          return;
        }
        adminRole = creator.role;
      }
      req.user = { id: apiKey.created_by, role: adminRole, isApiKey: true, scopes: apiKey.scopes };
      next();
      return;
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, JWT_SECRET2);
    if (decoded.role !== "admin" && decoded.role !== "owner") {
      res.status(403).json({ error: "Forbidden: Admin access only" });
      return;
    }
    if (decoded.id !== "temp-admin") {
      const { readJSON: readJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const users = await readJSON2("users.json") || [];
      const user = users.find((u) => u.id === decoded.id);
      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }
      if ((user.passwordVersion || 0) !== (decoded.passwordVersion || 0)) {
        res.status(401).json({ error: "Session expired" });
        return;
      }
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (token.startsWith("jtg-") || token.startsWith("jtg_")) {
    try {
      const { readJSON: readJSON2, writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const apiKeys = await readJSON2("api_keys.json") || [];
      const keyHash = import_crypto.default.createHash("sha256").update(token).digest("hex");
      const apiKey = apiKeys.find((k) => k.key_hash === keyHash);
      if (!apiKey || apiKey.revoked) {
        res.status(401).json({ error: "Invalid or revoked API key" });
        return;
      }
      if (apiKey.expires_at && new Date(apiKey.expires_at) < /* @__PURE__ */ new Date()) {
        res.status(401).json({ error: "API key expired" });
        return;
      }
      apiKey.last_used_at = (/* @__PURE__ */ new Date()).toISOString();
      await writeJSON2("api_keys.json", apiKeys);
      const users = await readJSON2("users.json") || [];
      let role = "admin";
      if (apiKey.created_by !== "temp-admin") {
        const creator = users.find((u) => u.id === apiKey.created_by);
        if (creator) {
          role = creator.role;
        }
      }
      req.user = { id: apiKey.created_by, role, isApiKey: true, scopes: apiKey.scopes };
      next();
      return;
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  }
  try {
    const decoded = import_jsonwebtoken2.default.verify(token, JWT_SECRET2);
    if (decoded.id !== "temp-admin") {
      const { readJSON: readJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
      const users = await readJSON2("users.json") || [];
      const user = users.find((u) => u.id === decoded.id);
      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }
      if ((user.passwordVersion || 0) !== (decoded.passwordVersion || 0)) {
        res.status(401).json({ error: "Session expired" });
        return;
      }
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// src/server/routes/auth.ts
var router = import_express.default.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);
router.get("/users", requireAuth, getUsers);
router.put("/password", requireAuth, changePassword);
router.put("/username", requireAuth, changeUsername);
var auth_default = router;

// src/server/routes/servers.ts
var import_express2 = __toESM(require("express"), 1);
var import_path5 = __toESM(require("path"), 1);

// src/server/controllers/servers.ts
init_db();

// src/server/services/sftp.ts
var import_ssh2 = __toESM(require("ssh2"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var import_fs_extra3 = __toESM(require("fs-extra"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_bcrypt = __toESM(require("bcrypt"), 1);
init_db();
var { Server } = import_ssh2.default;
var SFTP_PORT = 6868;
var HOST_KEYS_DIR = import_path3.default.join(process.cwd(), ".data", "ssh");
var SFTP_DB_FILE = "sftp_users.json";
async function initSFTPServer() {
  await import_fs_extra3.default.ensureDir(HOST_KEYS_DIR);
  let hostKeyPath = import_path3.default.join(HOST_KEYS_DIR, "host_rsa");
  if (!import_fs_extra3.default.existsSync(hostKeyPath)) {
    const { privateKey } = import_crypto2.default.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs1", format: "pem" }
    });
    import_fs_extra3.default.writeFileSync(hostKeyPath, privateKey);
  }
  if (!import_fs_extra3.default.existsSync(import_path3.default.join(process.cwd(), ".data", SFTP_DB_FILE))) {
    await writeJSON(SFTP_DB_FILE, []);
  }
  const hostKey = import_fs_extra3.default.readFileSync(hostKeyPath);
  const server = new Server({ hostKeys: [hostKey] }, (client) => {
    let sftpUser = null;
    client.on("authentication", async (ctx) => {
      try {
        if (ctx.method !== "password") {
          return ctx.reject();
        }
        const users = await readJSON(SFTP_DB_FILE) || [];
        const user = users.find((u) => u.username === ctx.username);
        if (!user) {
          return ctx.reject();
        }
        const match = await import_bcrypt.default.compare(ctx.password, user.passwordHash);
        if (match) {
          sftpUser = user;
          ctx.accept();
        } else {
          ctx.reject();
        }
      } catch (err) {
        console.error("SFTP auth error:", err);
        ctx.reject();
      }
    });
    client.on("ready", () => {
      client.on("session", (accept, reject) => {
        const session = accept();
        session.on("sftp", (accept2, reject2) => {
          if (!sftpUser) {
            return reject2();
          }
          const sftpStream = accept2();
          const userDir = import_path3.default.join(process.cwd(), ".data", "servers", sftpUser.serverId);
          console.log("SFTP session started for user", sftpUser.username);
          sftpStream.on("OPEN", (reqid, filename, flags, attrs) => {
            sftpStream.status(reqid, 4);
          });
          sftpStream.on("READDIR", (reqid, handle) => {
            sftpStream.status(reqid, 4);
          });
          sftpStream.on("STAT", (reqid, path7) => {
            sftpStream.status(reqid, 4);
          });
        });
      });
    });
    client.on("error", (err) => {
    });
  });
  server.listen(SFTP_PORT, "0.0.0.0", () => {
    console.log(`SFTP server listening on port ${SFTP_PORT}`);
  });
  process.on("SIGTERM", () => server.close());
  process.on("SIGINT", () => server.close());
}
async function createSftpUser(serverId) {
  const users = await readJSON(SFTP_DB_FILE) || [];
  if (users.find((u) => u.serverId === serverId)) {
    throw new Error("SFTP user already exists for this server");
  }
  const username = "srv_" + import_crypto2.default.randomBytes(3).toString("hex");
  const password = import_crypto2.default.randomBytes(8).toString("hex") + "!";
  const passwordHash = await import_bcrypt.default.hash(password, 10);
  const newUser = {
    id: import_crypto2.default.randomUUID(),
    serverId,
    username,
    passwordHash,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(newUser);
  await writeJSON(SFTP_DB_FILE, users);
  return { username, password };
}
async function resetSftpPassword(serverId) {
  const users = await readJSON(SFTP_DB_FILE) || [];
  const userIndex = users.findIndex((u) => u.serverId === serverId);
  if (userIndex === -1) {
    throw new Error("SFTP user not found");
  }
  const password = import_crypto2.default.randomBytes(8).toString("hex") + "!";
  users[userIndex].passwordHash = await import_bcrypt.default.hash(password, 10);
  users[userIndex].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
  await writeJSON(SFTP_DB_FILE, users);
  return { username: users[userIndex].username, password };
}
async function getSftpUser(serverId) {
  const users = await readJSON(SFTP_DB_FILE) || [];
  return users.find((u) => u.serverId === serverId);
}
async function deleteSftpUser(serverId) {
  const users = await readJSON(SFTP_DB_FILE) || [];
  const filtered = users.filter((u) => u.serverId !== serverId);
  await writeJSON(SFTP_DB_FILE, filtered);
}

// src/server/controllers/servers.ts
var import_crypto3 = __toESM(require("crypto"), 1);
var import_fs_extra4 = __toESM(require("fs-extra"), 1);
var import_path4 = __toESM(require("path"), 1);
var import_archiver = require("archiver");
var import_extract_zip = __toESM(require("extract-zip"), 1);
var getServers = async (req, res) => {
  const user = req.user;
  const servers = await readJSON("servers.json") || [];
  const userServers = user.role === "admin" || user.role === "owner" ? servers : servers.filter((s) => s.owner === user.id);
  const updatedServers = await Promise.all(userServers.map(async (server) => {
    if (server.containerId) {
      const status = await getContainerStatus(server.containerId, server.nodeId);
      server.status = status?.State?.Running ? "online" : "offline";
    }
    return server;
  }));
  res.json(updatedServers);
};
var getServer = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const servers = await readJSON("servers.json") || [];
  const server = servers.find((s) => s.id === id);
  if (!server) {
    res.status(404).json({ error: "Server not found" });
    return;
  }
  if (user.role !== "admin" && user.role !== "owner" && server.owner !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const status = await getContainerStatus(server.containerId, server.nodeId);
  server.status = status?.State?.Running ? "online" : "offline";
  res.json(server);
};
var getServerStats = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const servers = await readJSON("servers.json") || [];
  const server = servers.find((s) => s.id === id);
  if (!server) {
    res.status(404).json({ error: "Server not found" });
    return;
  }
  if (user.role !== "admin" && user.role !== "owner" && server.owner !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  if (server.containerId) {
    const stats = await getContainerStats(server.containerId, server.nodeId);
    res.json({
      ...stats,
      limitRam: server.ram ? server.ram * 1024 : 1024,
      limitCpu: server.cpu || 100,
      limitDisk: server.disk || 10
    });
  } else {
    res.json({ cpu: 0, ram: 0, disk: 0, limitRam: server.ram ? server.ram * 1024 : 1024, limitCpu: server.cpu || 100, limitDisk: server.disk || 10 });
  }
};
var createServer = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") {
    return res.status(403).json({ error: "Only admins can create servers" });
  }
  const { name, ram, port, version, theme, cpu, disk, owner, ipAlias, type, nodeId } = req.body;
  if (!name || !ram || !port) {
    res.status(400).json({ error: "Missing required fields (name, ram, port)" });
    return;
  }
  const id = import_crypto3.default.randomUUID();
  const serverData = {
    id,
    name,
    owner: owner || user.id,
    // Support assigning owner at creation
    ram,
    cpu: cpu || 100,
    disk: disk || 10,
    port,
    ipAlias: ipAlias || "",
    nodeId: nodeId || "local",
    type: type || "PAPER",
    version: version || "1.21.1",
    theme: theme || "default",
    status: "installing",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    containerId: null
  };
  const servers = await readJSON("servers.json") || [];
  if (servers.find((s) => s.port == port)) {
    res.status(400).json({ error: "Port is already in use by another server." });
    return;
  }
  servers.push(serverData);
  await writeJSON("servers.json", servers);
  try {
    const containerId = await createServerContainer(serverData);
    serverData.containerId = containerId;
    serverData.status = "offline";
    await writeJSON("servers.json", Object.assign(servers, servers.map((s) => s.id === id ? serverData : s)));
    await createSftpUser(id).catch((e) => console.error("SFTP user creation failed:", e));
    res.json(serverData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
var updateOwner = async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") {
    return res.status(403).json({ error: "Only admins can update owner" });
  }
  const { id } = req.params;
  const { owner } = req.body;
  if (!owner) return res.status(400).json({ error: "Owner required" });
  const servers = await readJSON("servers.json") || [];
  const server = servers.find((s) => s.id === id);
  if (!server) return res.status(404).json({ error: "Server not found" });
  server.owner = owner;
  await writeJSON("servers.json", servers);
  res.json({ success: true });
};
var updateIpAlias = async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { ipAlias } = req.body;
  const servers = await readJSON("servers.json") || [];
  const server = servers.find((s) => s.id === id);
  if (!server) return res.status(404).json({ error: "Server not found" });
  if (user.role !== "admin" && user.role !== "owner" && server.owner !== user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  server.ipAlias = ipAlias;
  await writeJSON("servers.json", servers);
  res.json({ success: true });
};
var deleteServer = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    let servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(403).json({ error: "Only admins can delete servers" });
    }
    if (server.containerId) {
      await deleteContainer(server.containerId, server.nodeId);
    }
    servers = servers.filter((s) => s.id !== id);
    await writeJSON("servers.json", servers);
    const serverDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
    try {
      await import_fs_extra4.default.remove(serverDir);
    } catch (e) {
      console.error("Failed to remove server directory", e);
    }
    await deleteSftpUser(id).catch((e) => console.error("SFTP user deletion failed:", e));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
var startServer = async (req, res) => {
  try {
    const { id } = req.params;
    const servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server || !server.containerId) {
      return res.status(404).json({ error: "Not found" });
    }
    if (server.suspended) {
      return res.status(403).json({ error: "Server is suspended" });
    }
    try {
      const io2 = req.app.get("io");
      if (io2) io2.to(`server_${id}`).emit("clear_logs");
      await startContainer(server.containerId, server.nodeId);
    } catch (startErr) {
      if (startErr.statusCode === 404 || startErr.message && startErr.message.toLowerCase().includes("no such container")) {
        console.log(`Container missing for server ${server.id}. Recreating...`);
        server.containerId = await createServerContainer(server);
        await writeJSON("servers.json", servers);
        await startContainer(server.containerId, server.nodeId);
      } else {
        throw startErr;
      }
    }
    await attachContainerSocket(server.containerId, server.id, server.nodeId);
    res.json({ success: true });
  } catch (err) {
    console.error("Start server error:", err);
    res.status(500).json({ error: err.message || "Failed to start server" });
  }
};
var stopServer = async (req, res) => {
  try {
    const { id } = req.params;
    const servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server || !server.containerId) {
      return res.status(404).json({ error: "Not found" });
    }
    try {
      await stopContainer(server.containerId, server.nodeId);
    } catch (stopErr) {
      if (stopErr.statusCode === 404 || stopErr.message && stopErr.message.toLowerCase().includes("no such container")) {
        console.log(`Container already missing for server ${server.id}. Assuming stopped.`);
      } else {
        throw stopErr;
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Stop server error:", err);
    res.status(500).json({ error: err.message || "Failed to stop server" });
  }
};
var restartServer = async (req, res) => {
  try {
    const { id } = req.params;
    const servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server || !server.containerId) {
      return res.status(404).json({ error: "Not found" });
    }
    try {
      const io2 = req.app.get("io");
      if (io2) io2.to(`server_${id}`).emit("clear_logs");
      await restartContainer(server.containerId, server.nodeId);
    } catch (startErr) {
      if (startErr.statusCode === 404 || startErr.message && startErr.message.toLowerCase().includes("no such container")) {
        console.log(`Container missing for server ${server.id}. Recreating...`);
        server.containerId = await createServerContainer(server);
        await writeJSON("servers.json", servers);
        await startContainer(server.containerId, server.nodeId);
      } else {
        throw startErr;
      }
    }
    await attachContainerSocket(server.containerId, server.id, server.nodeId);
    res.json({ success: true });
  } catch (err) {
    console.error("Restart server error:", err);
    res.status(500).json({ error: err.message || "Failed to restart server" });
  }
};
var sendCommand = async (req, res) => {
  try {
    const { id } = req.params;
    const { command } = req.body;
    const servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server || !server.containerId) {
      return res.status(404).json({ error: "Not found" });
    }
    await sendContainerCommand(server.containerId, command, server.nodeId);
    res.json({ success: true });
  } catch (err) {
    console.error("Command error:", err);
    res.status(500).json({ error: err.message || "Failed to send command" });
  }
};
var changeServerVersion = async (req, res) => {
  try {
    const { id } = req.params;
    const { version, type } = req.body;
    const user = req.user;
    if (!version) return res.status(400).json({ error: "Version is required" });
    let servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }
    if (user.role !== "admin" && user.role !== "owner" && server.owner !== user.id) {
      return res.status(403).json({ error: "Only admins or owners can change version" });
    }
    if (server.containerId) {
      const status = await getContainerStatus(server.containerId, server.nodeId);
      if (status?.State?.Running) {
        return res.status(400).json({ error: "Server must be stopped before changing version. Please stop the server first." });
      }
      await deleteContainer(server.containerId, server.nodeId);
    }
    const serverDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
    const filesToDelete = [
      "paper-global.yml",
      "paper-world-defaults.yml",
      "paper.yml",
      "config/paper-global.yml",
      "config/paper-world-defaults.yml",
      "world/data/random_sequences.dat"
    ];
    for (const file of filesToDelete) {
      const filePath = import_path4.default.join(serverDir, file);
      try {
        if (await import_fs_extra4.default.pathExists(filePath)) {
          await import_fs_extra4.default.remove(filePath);
        }
      } catch (e) {
        console.error(`Failed to delete ${file}`, e);
      }
    }
    server.version = version;
    if (type) {
      server.type = type;
    }
    const newContainerId = await createServerContainer(server);
    server.containerId = newContainerId;
    await writeJSON("servers.json", servers);
    res.json({ success: true, version, type: server.type });
  } catch (err) {
    console.error("Change version error", err);
    res.status(500).json({ error: err.message });
  }
};
var getFiles = async (req, res) => {
  const { id } = req.params;
  const dirPath = req.query.path ? String(req.query.path) : "/";
  const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, dirPath);
  if (!targetPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    const stats = await import_fs_extra4.default.stat(targetPath).catch(() => null);
    if (!stats) {
      return res.json([]);
    }
    if (stats.isFile()) {
      const content = await import_fs_extra4.default.readFile(targetPath, "utf-8");
      return res.json({ isFile: true, content });
    }
    const files = await import_fs_extra4.default.readdir(targetPath, { withFileTypes: true });
    res.json(files.map((f) => ({
      name: f.name,
      isDirectory: f.isDirectory(),
      size: f.isDirectory() ? 0 : import_fs_extra4.default.statSync(import_path4.default.join(targetPath, f.name)).size
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
var uploadFile = async (req, res) => {
  const { id } = req.params;
  const dirPath = req.body.path || "/";
  const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, dirPath);
  if (req.file) {
    await import_fs_extra4.default.ensureDir(targetPath);
    await import_fs_extra4.default.move(req.file.path, import_path4.default.join(targetPath, req.file.originalname), { overwrite: true });
  }
  res.json({ success: true });
};
var deleteFile = async (req, res) => {
  const { id } = req.params;
  const filePaths = req.body.paths || (req.body.path ? [req.body.path] : []);
  try {
    for (const filePath of filePaths) {
      const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, filePath);
      if (!targetPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
        return res.status(403).json({ error: "Invalid path" });
      }
      await import_fs_extra4.default.remove(targetPath);
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var zipFiles = async (req, res) => {
  const { id } = req.params;
  const { dirPath, fileNames, outputName } = req.body;
  const baseDir = import_path4.default.join(process.cwd(), ".data", "servers", id, dirPath);
  const outZipPath = import_path4.default.join(baseDir, outputName || "archive.zip");
  if (!baseDir.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    const output = import_fs_extra4.default.createWriteStream(outZipPath);
    const archive = new import_archiver.ZipArchive({ zlib: { level: 9 } });
    output.on("close", () => {
      res.json({ success: true, filename: outputName || "archive.zip" });
    });
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
    archive.pipe(output);
    for (const name of fileNames) {
      const filePath = import_path4.default.join(baseDir, name);
      const stat = await import_fs_extra4.default.stat(filePath);
      if (stat.isDirectory()) {
        archive.directory(filePath, name);
      } else {
        archive.file(filePath, { name });
      }
    }
    await archive.finalize();
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
};
var renameFile = async (req, res) => {
  const { id } = req.params;
  const { oldPath, newPath } = req.body;
  const targetOldPath = import_path4.default.join(process.cwd(), ".data", "servers", id, oldPath);
  const targetNewPath = import_path4.default.join(process.cwd(), ".data", "servers", id, newPath);
  if (!targetOldPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id)) || !targetNewPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    await import_fs_extra4.default.rename(targetOldPath, targetNewPath);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var downloadFile = async (req, res) => {
  const { id } = req.params;
  let rawPaths = [];
  if (req.query.paths) {
    rawPaths = Array.isArray(req.query.paths) ? req.query.paths : String(req.query.paths).split(",");
  } else if (req.query.path) {
    rawPaths = [String(req.query.path)];
  }
  if (rawPaths.length === 0) {
    return res.status(400).json({ error: "No path specified" });
  }
  const serverBaseDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
  try {
    if (rawPaths.length === 1) {
      const singlePath = rawPaths[0];
      const targetPath = import_path4.default.join(serverBaseDir, singlePath);
      if (!targetPath.startsWith(serverBaseDir)) {
        return res.status(403).json({ error: "Invalid path" });
      }
      const stat = await import_fs_extra4.default.stat(targetPath);
      if (!stat.isDirectory()) {
        return res.download(targetPath, import_path4.default.basename(targetPath));
      }
    }
    const zipName = rawPaths.length === 1 ? `${import_path4.default.basename(rawPaths[0]) || "folder"}.zip` : `download-${Date.now()}.zip`;
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${zipName}"`);
    const archive = new import_archiver.ZipArchive({ zlib: { level: 9 } });
    archive.on("error", (err) => {
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
    archive.pipe(res);
    for (const relPath of rawPaths) {
      const targetPath = import_path4.default.join(serverBaseDir, relPath);
      if (!targetPath.startsWith(serverBaseDir)) continue;
      const itemName = import_path4.default.basename(targetPath);
      const stat = await import_fs_extra4.default.stat(targetPath).catch(() => null);
      if (!stat) continue;
      if (stat.isDirectory()) {
        archive.directory(targetPath, itemName);
      } else {
        archive.file(targetPath, { name: itemName });
      }
    }
    await archive.finalize();
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
};
var unzipFile = async (req, res) => {
  const { id } = req.params;
  const { path: filePath } = req.body;
  const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, filePath);
  if (!targetPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    const destDir = import_path4.default.dirname(targetPath);
    await (0, import_extract_zip.default)(targetPath, { dir: destDir });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var createFile = async (req, res) => {
  const { id } = req.params;
  const { filePath } = req.body;
  const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, filePath);
  if (!targetPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    await import_fs_extra4.default.writeFile(targetPath, "", "utf-8");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var createDirectory = async (req, res) => {
  const { id } = req.params;
  const { filePath } = req.body;
  const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, filePath);
  if (!targetPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    await import_fs_extra4.default.mkdir(targetPath, { recursive: true });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var saveFileContent = async (req, res) => {
  const { id } = req.params;
  const { filePath, content } = req.body;
  const targetPath = import_path4.default.join(process.cwd(), ".data", "servers", id, filePath);
  if (!targetPath.startsWith(import_path4.default.join(process.cwd(), ".data", "servers", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    await import_fs_extra4.default.writeFile(targetPath, content, "utf-8");
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var getBackups = async (req, res) => {
  const { id } = req.params;
  const backupsDir = import_path4.default.join(process.cwd(), ".data", "backups", id);
  await import_fs_extra4.default.ensureDir(backupsDir);
  try {
    const files = await import_fs_extra4.default.readdir(backupsDir);
    const backups = [];
    for (const file of files) {
      if (file.endsWith(".zip")) {
        const stats = await import_fs_extra4.default.stat(import_path4.default.join(backupsDir, file));
        backups.push({
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime
        });
      }
    }
    backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    res.json(backups);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var createBackup = async (req, res) => {
  const { id } = req.params;
  const serverDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
  const backupsDir = import_path4.default.join(process.cwd(), ".data", "backups", id);
  await import_fs_extra4.default.ensureDir(backupsDir);
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  const filename = `backup-${timestamp}.zip`;
  const backupPath = import_path4.default.join(backupsDir, filename);
  try {
    const serverExists = await import_fs_extra4.default.pathExists(serverDir);
    if (!serverExists) {
      await import_fs_extra4.default.ensureDir(serverDir);
    }
    const output = import_fs_extra4.default.createWriteStream(backupPath);
    const archive = new import_archiver.ZipArchive({ zlib: { level: 9 } });
    output.on("close", () => {
      if (!res.headersSent) res.json({ success: true, filename });
    });
    archive.on("error", (err) => {
      console.error("Archive error:", err);
      if (!res.headersSent) res.status(500).json({ error: err.message });
    });
    archive.pipe(output);
    archive.directory(serverDir, false);
    await archive.finalize();
  } catch (e) {
    if (!res.headersSent) res.status(500).json({ error: e.message });
  }
};
var downloadBackup = async (req, res) => {
  const { id, filename } = req.params;
  const backupPath = import_path4.default.join(process.cwd(), ".data", "backups", id, filename);
  if (!backupPath.startsWith(import_path4.default.join(process.cwd(), ".data", "backups", id))) {
    return res.status(403).send("Invalid path");
  }
  if (await import_fs_extra4.default.pathExists(backupPath)) {
    res.download(backupPath);
  } else {
    res.status(404).send("Backup not found");
  }
};
var deleteBackup = async (req, res) => {
  const { id, filename } = req.params;
  const backupPath = import_path4.default.join(process.cwd(), ".data", "backups", id, filename);
  if (!backupPath.startsWith(import_path4.default.join(process.cwd(), ".data", "backups", id))) {
    return res.status(403).json({ error: "Invalid path" });
  }
  try {
    await import_fs_extra4.default.remove(backupPath);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
var installPlugin = async (req, res) => {
  const { id } = req.params;
  const { source, pluginId, pluginName } = req.body;
  if (req.body.downloadUrl) {
    try {
      const serverDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
      const pluginsDir = import_path4.default.join(serverDir, "plugins");
      await import_fs_extra4.default.ensureDir(pluginsDir);
      const filePath = import_path4.default.join(pluginsDir, req.body.filename);
      if (req.body.downloadUrl === "dummy") {
        await import_fs_extra4.default.writeFile(filePath, "");
      } else {
        const axios = (await import("axios")).default;
        const response = await axios({ url: req.body.downloadUrl, method: "GET", responseType: "stream" });
        const writer = import_fs_extra4.default.createWriteStream(filePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
          writer.on("finish", resolve);
          writer.on("error", reject);
        });
      }
      return res.json({ success: true, message: "Plugin installed successfully" });
    } catch (e) {
      return res.status(500).json({ error: "Failed to install plugin" });
    }
  }
  if (!source || !pluginId || !pluginName) {
    return res.status(400).json({ error: "Missing source, pluginId, or pluginName" });
  }
  try {
    const serverDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
    const pluginsDir = import_path4.default.join(serverDir, "plugins");
    await import_fs_extra4.default.ensureDir(pluginsDir);
    let downloadUrl = null;
    let filename = `${pluginName.replace(/[^a-zA-Z0-9]/g, "_")}.jar`;
    const axios = (await import("axios")).default;
    const resolveGithubRelease = async (extUrl) => {
      if (extUrl.includes("github.com") && extUrl.includes("/releases/")) {
        let apiUrl = null;
        const match = extUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/releases\/tag\/([^\/]+)/);
        if (match) {
          apiUrl = `https://api.github.com/repos/${match[1]}/${match[2]}/releases/tags/${match[3]}`;
        } else {
          const matchLatest = extUrl.match(/github\.com\/([^\/]+)\/([^\/]+)\/releases\/latest/);
          if (matchLatest) {
            apiUrl = `https://api.github.com/repos/${matchLatest[1]}/${matchLatest[2]}/releases/latest`;
          }
        }
        if (apiUrl) {
          try {
            const ghRes = await axios.get(apiUrl);
            if (ghRes.data && ghRes.data.assets) {
              const jarAsset = ghRes.data.assets.find((a) => a.name.endsWith(".jar"));
              if (jarAsset) {
                return { url: jarAsset.browser_download_url, filename: jarAsset.name };
              }
            }
          } catch (e) {
            console.error("GitHub API error:", e);
          }
        }
      }
      return null;
    };
    if (source === "modrinth") {
      const verRes = await axios.get(`https://api.modrinth.com/v2/project/${pluginId}/version`);
      if (verRes.data && verRes.data.length > 0) {
        const file = verRes.data[0].files.find((f) => f.primary) || verRes.data[0].files[0];
        if (file) {
          downloadUrl = file.url;
          filename = file.filename || filename;
        }
      }
    } else if (source === "spigot") {
      const apiRes = await axios.get(`https://api.spiget.org/v2/resources/${pluginId}`);
      if (apiRes.data && apiRes.data.file) {
        if (apiRes.data.file.type === "external" && apiRes.data.file.externalUrl) {
          const extUrl = apiRes.data.file.externalUrl;
          const ghAsset = await resolveGithubRelease(extUrl);
          if (ghAsset) {
            downloadUrl = ghAsset.url;
            filename = ghAsset.filename;
          }
          if (!downloadUrl) {
            return res.status(400).json({ error: "This plugin must be downloaded externally from: " + extUrl });
          }
        } else {
          downloadUrl = `https://api.spiget.org/v2/resources/${pluginId}/download`;
        }
      } else {
        downloadUrl = `https://api.spiget.org/v2/resources/${pluginId}/download`;
      }
    } else if (source === "hangar") {
      const [owner, slug] = pluginId.split("/");
      const verRes = await axios.get(`https://hangar.papermc.io/api/v1/projects/${owner}/${slug}/versions`);
      if (verRes.data && verRes.data.result && verRes.data.result.length > 0) {
        const version = verRes.data.result[0];
        const download = version.downloads.PAPER || Object.values(version.downloads)[0];
        if (download && download.downloadUrl) {
          downloadUrl = download.downloadUrl;
          if (download.fileInfo && download.fileInfo.name) {
            filename = download.fileInfo.name;
          }
        } else if (download && download.externalUrl) {
          const extUrl = download.externalUrl;
          const ghAsset = await resolveGithubRelease(extUrl);
          if (ghAsset) {
            downloadUrl = ghAsset.url;
            filename = ghAsset.filename;
          } else {
            return res.status(400).json({ error: "This plugin must be downloaded externally from: " + extUrl });
          }
        }
      }
    }
    if (!downloadUrl) {
      return res.status(404).json({ error: "Could not find a valid download URL for this plugin." });
    }
    const filePath = import_path4.default.join(pluginsDir, filename);
    const response = await axios({
      url: downloadUrl,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent": "React-Minecraft-Panel/1.0"
      }
    });
    const writer = import_fs_extra4.default.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    res.json({ success: true, message: "Plugin installed successfully" });
  } catch (error) {
    console.error("Plugin installation failed:", error.message);
    res.status(500).json({ error: "Plugin installation failed: " + error.message });
  }
};
var installMod = async (req, res) => {
  const { id } = req.params;
  const { pluginId, pluginName } = req.body;
  if (!pluginId || !pluginName) {
    return res.status(400).json({ error: "Missing pluginId or pluginName" });
  }
  try {
    const serverDir = import_path4.default.join(process.cwd(), ".data", "servers", id);
    const modsDir = import_path4.default.join(serverDir, "mods");
    await import_fs_extra4.default.ensureDir(modsDir);
    let downloadUrl = null;
    let filename = `${pluginName.replace(/[^a-zA-Z0-9]/g, "_")}.jar`;
    const axios = (await import("axios")).default;
    const verRes = await axios.get(`https://api.modrinth.com/v2/project/${pluginId}/version`);
    if (verRes.data && verRes.data.length > 0) {
      const file = verRes.data[0].files.find((f) => f.primary) || verRes.data[0].files[0];
      if (file) {
        downloadUrl = file.url;
        filename = file.filename || filename;
      }
    }
    if (!downloadUrl) {
      return res.status(404).json({ error: "Could not find a valid download URL for this mod." });
    }
    const filePath = import_path4.default.join(modsDir, filename);
    const response = await axios({
      url: downloadUrl,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent": "React-Minecraft-Panel/1.0"
      }
    });
    const writer = import_fs_extra4.default.createWriteStream(filePath);
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
    res.json({ success: true, message: "Mod installed successfully" });
  } catch (error) {
    console.error("Mod installation failed:", error.message);
    res.status(500).json({ error: "Mod installation failed: " + error.message });
  }
};
var updateResources = async (req, res) => {
  try {
    const { id } = req.params;
    const { ram, cpu, disk } = req.body;
    const servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server) return res.status(404).json({ error: "Server not found" });
    if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });
    server.ram = Number(ram);
    server.cpu = Number(cpu);
    server.disk = Number(disk);
    await writeJSON("servers.json", servers);
    if (server.containerId) {
      try {
        await stopContainer(server.containerId, server.nodeId);
      } catch (e) {
      }
    }
    res.json(server);
  } catch (error) {
    res.status(500).json({ error: "Failed to update resources" });
  }
};
var updateSuspend = async (req, res) => {
  try {
    const { id } = req.params;
    const { suspendDuration } = req.body;
    const servers = await readJSON("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server) return res.status(404).json({ error: "Server not found" });
    if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });
    server.suspended = suspendDuration !== null;
    server.suspendDuration = suspendDuration;
    await writeJSON("servers.json", servers);
    if (server.suspended && server.containerId) {
      try {
        await stopContainer(server.containerId, server.nodeId);
      } catch (e) {
      }
    }
    res.json(server);
  } catch (error) {
    res.status(500).json({ error: "Failed to suspend server" });
  }
};

// src/server/routes/servers.ts
var import_multer = __toESM(require("multer"), 1);
var router2 = import_express2.default.Router();
var upload = (0, import_multer.default)({ dest: import_path5.default.join(process.cwd(), ".data/temp/") });
router2.use(requireAuth);
router2.get("/", getServers);
router2.post("/", createServer);
router2.get("/:id", getServer);
router2.get("/:id/stats", getServerStats);
router2.delete("/:id", deleteServer);
router2.put("/:id/owner", updateOwner);
router2.put("/:id/ipalias", updateIpAlias);
router2.put("/:id/version", changeServerVersion);
router2.put("/:id/resources", updateResources);
router2.put("/:id/suspend", updateSuspend);
router2.post("/:id/start", startServer);
router2.post("/:id/stop", stopServer);
router2.post("/:id/restart", restartServer);
router2.post("/:id/command", sendCommand);
router2.get("/:id/files", getFiles);
router2.get("/:id/files/download", downloadFile);
router2.post("/:id/files/upload", upload.single("file"), uploadFile);
router2.post("/:id/files/rename", renameFile);
router2.post("/:id/files/save", saveFileContent);
router2.post("/:id/files/create", createFile);
router2.post("/:id/files/mkdir", createDirectory);
router2.post("/:id/files/unzip", unzipFile);
router2.post("/:id/files/zip", zipFiles);
router2.delete("/:id/files", deleteFile);
router2.get("/:id/backups", getBackups);
router2.post("/:id/backups", createBackup);
router2.get("/:id/backups/:filename", downloadBackup);
router2.delete("/:id/backups/:filename", deleteBackup);
router2.get("/:id/playit", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const { id } = req.params;
  const serversJSON = await (await import("fs/promises")).readFile(import_path5.default.join(process.cwd(), ".data", "servers.json"), "utf8");
  const servers = JSON.parse(serversJSON);
  const server = servers.find((s) => s.id === id);
  const serverName = server ? server.name.replace(/[^a-zA-Z0-9_-]/g, "_") : id;
  const pm2Name = `playit_${serverName}`;
  const { exec: exec2 } = await import("child_process");
  console.log("running exec...");
  exec2("npx pm2 jlist", (err, stdout) => {
    let status = "stopped";
    try {
      const jsonStart = stdout.indexOf("[");
      const jsonEnd = stdout.lastIndexOf("]");
      const jsonStr = jsonStart !== -1 && jsonEnd !== -1 ? stdout.substring(jsonStart, jsonEnd + 1) : stdout;
      const pm2List = JSON.parse(jsonStr);
      const playitProcess = pm2List.find((p) => p.name === pm2Name);
      if (playitProcess && playitProcess.pm2_env && playitProcess.pm2_env.status === "online") {
        status = "running";
      }
    } catch (e) {
    }
    if (status === "running") {
      exec2(`npx pm2 logs ${pm2Name} --nostream --lines 100`, (err2, logStdout, logStderr) => {
        const logs = (logStdout || "").replace(/\x1b\[[0-9;]*[a-zA-Z]|\x1b./g, "");
        const claimLinkMatches = logs.match(/https:\/\/playit\.gg\/claim\/[a-zA-Z0-9]+/g);
        res.json({
          status,
          claimLink: claimLinkMatches ? claimLinkMatches[claimLinkMatches.length - 1] : null,
          logs: logs.split("\n").slice(-50).join("\n")
        });
      });
    } else {
      res.json({ status: "stopped", claimLink: null, logs: "" });
    }
  });
});
router2.post("/:id/playit/start", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const { id } = req.params;
  const serversJSON = await (await import("fs/promises")).readFile(import_path5.default.join(process.cwd(), ".data", "servers.json"), "utf8");
  const servers = JSON.parse(serversJSON);
  const server = servers.find((s) => s.id === id);
  const serverName = server ? server.name.replace(/[^a-zA-Z0-9_-]/g, "_") : id;
  const pm2Name = `playit_${serverName}`;
  const serverDir = import_path5.default.join(process.cwd(), ".data", "servers", id);
  const playitBin = import_path5.default.join(serverDir, `playit_${serverName}`);
  const secretPath = import_path5.default.join(serverDir, "playit.toml");
  const { exec: exec2 } = await import("child_process");
  const setupCmd = `mkdir -p "${serverDir}"; if [ ! -f "${playitBin}" ]; then wget -qO "${playitBin}" "https://github.com/playit-cloud/playit-agent/releases/download/v0.15.26/playit-linux-amd64" && chmod +x "${playitBin}"; fi`;
  exec2(`npx pm2 delete ${pm2Name} || true; npx pm2 flush ${pm2Name} || true; ${setupCmd} && npx pm2 start "${playitBin}" --name ${pm2Name} -- -s --secret_path "${secretPath}" && npx pm2 save`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: "Failed to start Playit Tunnel", details: stderr });
    }
    res.json({ success: true });
  });
});
router2.post("/:id/playit/stop", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const { id } = req.params;
  const serversJSON = await (await import("fs/promises")).readFile(import_path5.default.join(process.cwd(), ".data", "servers.json"), "utf8");
  const servers = JSON.parse(serversJSON);
  const server = servers.find((s) => s.id === id);
  const serverName = server ? server.name.replace(/[^a-zA-Z0-9_-]/g, "_") : id;
  const pm2Name = `playit_${serverName}`;
  const { exec: exec2 } = await import("child_process");
  exec2(`npx pm2 delete ${pm2Name} && npx pm2 save`, (err, stdout, stderr) => {
    res.json({ success: true });
  });
});
router2.post("/:id/playit/reset", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const { id } = req.params;
  const serversJSON = await (await import("fs/promises")).readFile(import_path5.default.join(process.cwd(), ".data", "servers.json"), "utf8");
  const servers = JSON.parse(serversJSON);
  const server = servers.find((s) => s.id === id);
  const serverName = server ? server.name.replace(/[^a-zA-Z0-9_-]/g, "_") : id;
  const pm2Name = `playit_${serverName}`;
  const serverDir = import_path5.default.join(process.cwd(), ".data", "servers", id);
  const secretPath = import_path5.default.join(serverDir, "playit.toml");
  const { exec: exec2 } = await import("child_process");
  exec2(`npx pm2 delete ${pm2Name} || true; npx pm2 flush ${pm2Name} || true; rm -f "${secretPath}" && npx pm2 save`, (err, stdout, stderr) => {
    res.json({ success: true });
  });
});
router2.get("/:id/subusers", async (req, res) => {
  try {
    const { id } = req.params;
    const { readJSON: readJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const servers = await readJSON2("servers.json") || [];
    const server = servers.find((s) => s.id === id);
    if (!server) return res.status(404).json({ error: "Server not found" });
    const users = await readJSON2("users.json") || [];
    res.json({
      subUsers: server.subUsers || [],
      availableUsers: users.map((u) => ({ id: u.id, username: u.username }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/:id/subusers", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, permissions } = req.body;
    const { readJSON: readJSON2, writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const servers = await readJSON2("servers.json") || [];
    const serverIndex = servers.findIndex((s) => s.id === id);
    if (serverIndex === -1) return res.status(404).json({ error: "Server not found" });
    if (!servers[serverIndex].subUsers) servers[serverIndex].subUsers = [];
    const subUserIndex = servers[serverIndex].subUsers.findIndex((su) => su.userId === userId);
    if (subUserIndex !== -1) {
      servers[serverIndex].subUsers[subUserIndex].permissions = permissions;
    } else {
      servers[serverIndex].subUsers.push({ userId, permissions });
    }
    await writeJSON2("servers.json", servers);
    res.json({ success: true, subUsers: servers[serverIndex].subUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.delete("/:id/subusers/:userId", async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { readJSON: readJSON2, writeJSON: writeJSON2 } = await Promise.resolve().then(() => (init_db(), db_exports));
    const servers = await readJSON2("servers.json") || [];
    const serverIndex = servers.findIndex((s) => s.id === id);
    if (serverIndex === -1) return res.status(404).json({ error: "Server not found" });
    if (!servers[serverIndex].subUsers) servers[serverIndex].subUsers = [];
    servers[serverIndex].subUsers = servers[serverIndex].subUsers.filter((su) => su.userId !== userId);
    await writeJSON2("servers.json", servers);
    res.json({ success: true, subUsers: servers[serverIndex].subUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.get("/:id/sftp", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getSftpUser(id);
    if (!user) return res.status(404).json({ error: "SFTP user not found" });
    res.json({
      host: req.headers.host?.split(":")[0] || "127.0.0.1",
      port: 6868,
      username: user.username,
      password: "(Hidden - Reset to reveal)"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/:id/sftp/create", async (req, res) => {
  try {
    const { id } = req.params;
    const creds = await createSftpUser(id);
    res.json({
      host: req.headers.host?.split(":")[0] || "127.0.0.1",
      port: 6868,
      username: creds.username,
      password: creds.password
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/:id/sftp/reset-password", async (req, res) => {
  try {
    const { id } = req.params;
    const creds = await resetSftpPassword(id);
    res.json({
      host: req.headers.host?.split(":")[0] || "127.0.0.1",
      port: 6868,
      username: creds.username,
      password: creds.password
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.delete("/:id/sftp", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSftpUser(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router2.post("/:id/plugins/install", installPlugin);
router2.post("/:id/mods/install", installMod);
var servers_default = router2;

// src/server/routes/system.ts
var import_express3 = __toESM(require("express"), 1);
var import_os = __toESM(require("os"), 1);
var import_child_process = require("child_process");
var import_util = __toESM(require("util"), 1);
init_db();
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var execPromise = import_util.default.promisify(import_child_process.exec);
var router3 = import_express3.default.Router();
router3.use(requireAuth);
router3.get("/versions", async (req, res) => {
  const type = req.query.type || "PAPER";
  const versions = await getVersions(type);
  res.json(versions);
});
router3.get("/paper-versions", async (req, res) => {
  const versions = await getVersions("PAPER");
  res.json(versions);
});
function getCpuUsage() {
  return new Promise((resolve) => {
    const startCpus = import_os.default.cpus();
    setTimeout(() => {
      const endCpus = import_os.default.cpus();
      let totalIdle = 0, totalTick = 0;
      for (let i = 0, len = startCpus.length; i < len; i++) {
        const start = startCpus[i].times;
        const end = endCpus[i].times;
        const startTick = start.user + start.nice + start.sys + start.idle + start.irq;
        const endTick = end.user + end.nice + end.sys + end.idle + end.irq;
        const idle = end.idle - start.idle;
        const total = endTick - startTick;
        totalIdle += idle;
        totalTick += total;
      }
      const usage = 100 - ~~(100 * totalIdle / totalTick);
      resolve(usage);
    }, 100);
  });
}
router3.get("/stats", async (req, res) => {
  let diskSpace = 0;
  try {
    const { stdout } = await execPromise("df -h /home");
    const lines = stdout.split("\n");
    if (lines.length > 1) {
      const parts = lines[1].trim().split(/\s+/);
      if (parts.length >= 5) {
        diskSpace = parseInt(parts[4].replace("%", "")) || 0;
      }
    }
  } catch (err) {
  }
  const totalMemory = import_os.default.totalmem();
  const freeMemory = import_os.default.freemem();
  let cpuUsage = await getCpuUsage();
  let activeContainers = 0;
  let totalContainers = 0;
  try {
    if (isSandbox) {
      totalContainers = Object.keys(mockState).length;
      activeContainers = Object.values(mockState).filter((v) => v).length;
    } else {
      const docker = await getDocker();
      const containers = await docker.listContainers({ all: true });
      totalContainers = containers.length;
      activeContainers = containers.filter((c) => c.State === "running").length;
    }
  } catch (err) {
  }
  res.json({
    cpuUsage,
    totalMemory,
    freeMemory,
    ramUsage: Math.round((totalMemory - freeMemory) / totalMemory * 100),
    diskUsage: diskSpace,
    activeContainers,
    totalContainers
  });
});
router3.get("/users", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const users = await readJSON("users.json") || [];
  res.json(users.map((u) => ({ id: u.id, username: u.username, role: u.role || "admin", isGoogleUser: !!u.googleId, createdAt: u.createdAt })));
});
router3.post("/users", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const { username, password, role } = req.body;
  if (!username || !password || !role) return res.status(400).json({ error: "Missing fields" });
  const users = await readJSON("users.json") || [];
  if (users.find((u) => u.username === username)) return res.status(400).json({ error: "Username taken" });
  const hashedPassword = await import_bcryptjs2.default.hash(password, 10);
  const newUserId = Date.now().toString();
  users.push({
    id: newUserId,
    username,
    password: hashedPassword,
    role,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  await writeJSON("users.json", users);
  res.json({ success: true, id: newUserId, username, role });
});
router3.delete("/users/:id", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  let users = await readJSON("users.json") || [];
  users = users.filter((u) => u.id !== req.params.id);
  await writeJSON("users.json", users);
  res.json({ success: true });
});
router3.put("/users/:id/password", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  const users = await readJSON("users.json") || [];
  const targetIndex = users.findIndex((u) => u.id === req.params.id);
  if (targetIndex === -1) return res.status(404).json({ error: "User not found" });
  if (users[targetIndex].id === "temp-admin") {
    return res.status(400).json({ error: "Cannot change password of default admin account." });
  }
  if (users[targetIndex].googleId || !users[targetIndex].password) {
    return res.status(400).json({ error: "Cannot change password for Google authenticated accounts." });
  }
  const bcrypt4 = await import("bcryptjs");
  const hashedPassword = await bcrypt4.default.hash(newPassword, 10);
  users[targetIndex].password = hashedPassword;
  users[targetIndex].passwordVersion = (users[targetIndex].passwordVersion || 0) + 1;
  await writeJSON("users.json", users);
  res.json({ success: true });
});
router3.put("/settings", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const {
    panelName,
    panelLogo,
    panelBackgroundImage,
    panelBackgroundBlur,
    enablePlayit,
    enableTutorial,
    enableLoginAnimation,
    enableRegistration,
    theme,
    enableGoogleLogin,
    firebaseApiKey,
    firebaseAuthDomain,
    firebaseProjectId,
    firebaseStorageBucket,
    firebaseMessagingSenderId,
    firebaseAppId
  } = req.body;
  const settings = await readJSON("settings.json") || {};
  if (panelName !== void 0) {
    settings.panelName = panelName || "JTG Panel";
    try {
      const fs6 = await import("fs/promises");
      const path7 = await import("path");
      const targetPaths = [
        path7.join(process.cwd(), "index.html"),
        path7.join(process.cwd(), "dist", "index.html")
      ];
      for (const p of targetPaths) {
        try {
          let html = await fs6.readFile(p, "utf-8");
          html = html.replace(/<title>.*<\/title>/i, `<title>${settings.panelName}</title>`);
          await fs6.writeFile(p, html, "utf-8");
        } catch (e) {
        }
      }
    } catch (err) {
      console.error("Error updating html title:", err);
    }
  }
  if (panelLogo !== void 0) settings.panelLogo = panelLogo;
  if (panelBackgroundImage !== void 0) settings.panelBackgroundImage = panelBackgroundImage;
  if (panelBackgroundBlur !== void 0) settings.panelBackgroundBlur = panelBackgroundBlur;
  if (enablePlayit !== void 0) settings.enablePlayit = enablePlayit;
  if (enableTutorial !== void 0) settings.enableTutorial = enableTutorial;
  if (enableLoginAnimation !== void 0) settings.enableLoginAnimation = enableLoginAnimation;
  if (enableRegistration !== void 0) settings.enableRegistration = enableRegistration;
  if (theme !== void 0) settings.theme = theme;
  if (enableGoogleLogin !== void 0) settings.enableGoogleLogin = enableGoogleLogin;
  if (firebaseApiKey !== void 0) settings.firebaseApiKey = firebaseApiKey;
  if (firebaseAuthDomain !== void 0) settings.firebaseAuthDomain = firebaseAuthDomain;
  if (firebaseProjectId !== void 0) settings.firebaseProjectId = firebaseProjectId;
  if (firebaseStorageBucket !== void 0) settings.firebaseStorageBucket = firebaseStorageBucket;
  if (firebaseMessagingSenderId !== void 0) settings.firebaseMessagingSenderId = firebaseMessagingSenderId;
  if (firebaseAppId !== void 0) settings.firebaseAppId = firebaseAppId;
  await writeJSON("settings.json", settings);
  req.app.get("io")?.emit("settings_updated");
  res.json({ success: true });
});
router3.post("/update", async (req, res) => {
  const user = req.user;
  if (user.role !== "admin" && user.role !== "owner") return res.status(403).json({ error: "Forbidden" });
  const io2 = req.app.get("io");
  if (io2) {
    io2.emit("system_update_started");
  }
  res.json({ success: true, message: "Update process started" });
  const { exec: exec2 } = await import("child_process");
  setTimeout(() => {
    exec2("bash update.sh", (error, stdout, stderr) => {
      console.log(`Update stdout: ${stdout}`);
      console.error(`Update stderr: ${stderr}`);
    });
  }, 1e3);
});
var system_default = router3;

// src/server/routes/api-keys.ts
var import_express4 = __toESM(require("express"), 1);
var import_crypto4 = __toESM(require("crypto"), 1);
init_db();
var router4 = import_express4.default.Router();
router4.use(requireAdmin);
router4.get("/", async (req, res) => {
  try {
    const apiKeys = await readJSON("api_keys.json") || [];
    const keysWithoutHash = apiKeys.map((key) => ({
      id: key.id,
      label: key.label,
      scopes: key.scopes,
      created_by: key.created_by,
      created_at: key.created_at,
      expires_at: key.expires_at,
      last_used_at: key.last_used_at,
      revoked: key.revoked
    }));
    res.json(keysWithoutHash);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router4.post("/", async (req, res) => {
  try {
    const { label, scopes, expires_at } = req.body;
    const user = req.user;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomBytes = import_crypto4.default.randomBytes(14);
    let rawKey = "";
    for (let i = 0; i < 14; i++) {
      rawKey += chars[randomBytes[i] % chars.length];
    }
    const keyString = `jtg-${rawKey}`;
    const keyHash = import_crypto4.default.createHash("sha256").update(keyString).digest("hex");
    const apiKeys = await readJSON("api_keys.json") || [];
    const newKey = {
      id: import_crypto4.default.randomUUID(),
      key_hash: keyHash,
      label: label || "Unnamed Key",
      scopes: scopes || ["*"],
      created_by: user.id,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      expires_at: expires_at || null,
      last_used_at: null,
      revoked: false
    };
    apiKeys.push(newKey);
    await writeJSON("api_keys.json", apiKeys);
    res.json({
      success: true,
      key: keyString,
      // Only show once
      id: newKey.id,
      label: newKey.label,
      scopes: newKey.scopes,
      expires_at: newKey.expires_at
    });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router4.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const apiKeys = await readJSON("api_keys.json") || [];
    const keyIndex = apiKeys.findIndex((k) => k.id === id);
    if (keyIndex === -1) {
      return res.status(404).json({ error: "Key not found" });
    }
    apiKeys.splice(keyIndex, 1);
    await writeJSON("api_keys.json", apiKeys);
    res.json({ success: true, message: "Key deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
var api_keys_default = router4;

// src/server/routes/nodes.ts
var import_express5 = __toESM(require("express"), 1);
var import_crypto5 = __toESM(require("crypto"), 1);
init_db();
var router5 = import_express5.default.Router();
var NODES_FILE = "nodes.json";
var initNodes = async () => {
  let nodes = await readJSON(NODES_FILE);
  if (!nodes) {
    nodes = [
      {
        id: "local",
        name: "Local Node",
        ip: "127.0.0.1",
        port: 6767,
        key: "local",
        isLocal: true,
        status: "online",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ];
    await writeJSON(NODES_FILE, nodes);
  }
};
initNodes();
router5.use(requireAdmin);
router5.get("/", async (req, res) => {
  let nodes = await readJSON(NODES_FILE) || [];
  nodes = await Promise.all(nodes.map(async (node) => {
    if (node.isLocal) {
      node.status = "online";
      return node;
    }
    try {
      const docker = await getDocker(node.id);
      await docker.ping();
      node.status = "online";
    } catch (e) {
      console.error(`Ping failed for node ${node.id}:`, e.message || e);
      node.status = "offline";
    }
    return node;
  }));
  res.json(nodes);
});
router5.post("/", async (req, res) => {
  const { name, ip, port, key } = req.body;
  if (!name || !ip || !key) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const nodes = await readJSON(NODES_FILE) || [];
  const newNode = {
    id: import_crypto5.default.randomBytes(8).toString("hex"),
    name,
    ip,
    port: port ? Number(port) : 6768,
    key,
    isLocal: false,
    status: "connecting",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  nodes.push(newNode);
  await writeJSON(NODES_FILE, nodes);
  res.json(newNode);
});
router5.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (id === "local") return res.status(400).json({ error: "Cannot delete local node" });
  const nodes = await readJSON(NODES_FILE) || [];
  const filtered = nodes.filter((n) => n.id !== id);
  await writeJSON(NODES_FILE, filtered);
  res.json({ success: true });
});
var nodes_default = router5;

// src/server/routes/api.ts
var router6 = import_express6.default.Router();
router6.use("/auth", auth_default);
router6.use("/servers", servers_default);
router6.use("/system", system_default);
router6.use("/admin/api-keys", api_keys_default);
router6.use("/nodes", nodes_default);
router6.get("/settings", async (req, res) => {
  const settings = await readJSON("settings.json") || {};
  res.json({
    panelName: settings.panelName || "JTG Panel",
    panelLogo: settings.panelLogo || "",
    panelBackgroundImage: settings.panelBackgroundImage || "",
    panelBackgroundBlur: settings.panelBackgroundBlur !== void 0 ? settings.panelBackgroundBlur : 10,
    enablePlayit: settings.enablePlayit !== void 0 ? settings.enablePlayit : false,
    enableTutorial: settings.enableTutorial !== void 0 ? settings.enableTutorial : true,
    enableLoginAnimation: settings.enableLoginAnimation !== void 0 ? settings.enableLoginAnimation : true,
    enableRegistration: settings.enableRegistration !== void 0 ? settings.enableRegistration : true,
    theme: settings.theme || "dark",
    enableGoogleLogin: settings.enableGoogleLogin !== void 0 ? settings.enableGoogleLogin : false,
    firebaseApiKey: settings.firebaseApiKey || "",
    firebaseAuthDomain: settings.firebaseAuthDomain || "",
    firebaseProjectId: settings.firebaseProjectId || "",
    firebaseStorageBucket: settings.firebaseStorageBucket || "",
    firebaseMessagingSenderId: settings.firebaseMessagingSenderId || "",
    firebaseAppId: settings.firebaseAppId || ""
  });
});
var api_default = router6;

// server.ts
var app = (0, import_express7.default)();
var httpServer = (0, import_http.createServer)(app);
var io = new import_socket.Server(httpServer, {
  cors: { origin: "*" }
});
app.set("io", io);
var DATA_DIR2 = import_path6.default.join(process.cwd(), ".data");
var SERVERS_DIR = import_path6.default.join(DATA_DIR2, "servers");
var BACKUPS_DIR = import_path6.default.join(process.cwd(), "backups");
import_fs_extra5.default.ensureDirSync(DATA_DIR2);
import_fs_extra5.default.ensureDirSync(SERVERS_DIR);
import_fs_extra5.default.ensureDirSync(BACKUPS_DIR);
import_fs_extra5.default.ensureDirSync(import_path6.default.join(DATA_DIR2, "temp"));
if (!import_fs_extra5.default.existsSync(import_path6.default.join(DATA_DIR2, "users.json"))) import_fs_extra5.default.writeFileSync(import_path6.default.join(DATA_DIR2, "users.json"), "[]");
if (!import_fs_extra5.default.existsSync(import_path6.default.join(DATA_DIR2, "servers.json"))) import_fs_extra5.default.writeFileSync(import_path6.default.join(DATA_DIR2, "servers.json"), "[]");
if (!import_fs_extra5.default.existsSync(import_path6.default.join(DATA_DIR2, "settings.json"))) import_fs_extra5.default.writeFileSync(import_path6.default.join(DATA_DIR2, "settings.json"), "{}");
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication error"));
  try {
    const verified = import_jsonwebtoken3.default.verify(token, process.env.JWT_SECRET || "jtg-panel-super-secret");
    socket.user = verified;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});
io.on("connection", (socket) => {
  socket.on("joinServer", async (serverId) => {
    socket.join(`server_${serverId}`);
    try {
      const serversJSON = await import_fs_extra5.default.readFile(import_path6.default.join(DATA_DIR2, "servers.json"), "utf8");
      const servers = JSON.parse(serversJSON);
      const server = Array.isArray(servers) ? servers.find((s) => s.id === serverId) : null;
      if (server && server.containerId) {
        const logs = await getContainerLogs(server.containerId);
        if (logs) {
          socket.emit("log", logs.trim() + "\n");
        }
        await attachContainerSocket(server.containerId, serverId);
      }
    } catch (e) {
      console.error(e);
    }
  });
  socket.on("leaveServer", (serverId) => {
    socket.leave(`server_${serverId}`);
  });
});
var PORT = process.env.PORT || 6767;
app.use(import_express7.default.json({ limit: "50gb" }));
app.use(import_express7.default.urlencoded({ extended: true, limit: "50gb" }));
app.use((0, import_cors.default)());
app.use("/api", api_default);
async function startServer2() {
  await initSFTPServer();
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path6.default.join(process.cwd(), "dist");
    app.use(import_express7.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path6.default.join(distPath, "index.html"));
    });
  }
  httpServer.listen(PORT, () => {
    console.log(`JTG Panel running on port ${PORT}`);
  });
}
startServer2();
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  import_fs_extra5.default.writeFileSync("crash.log", String(err.stack));
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
  import_fs_extra5.default.writeFileSync("crash.log", String(reason));
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  io
});
//# sourceMappingURL=server.cjs.map
