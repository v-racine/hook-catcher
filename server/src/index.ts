import "dotenv/config";
import Config from "./config";
import app from "./app";
import wsManager from "./websockets/connectionManager";
import http from "http";
import { startScheduledCleanup } from "./cleanup/scheduledCleanup";

const { port } = Config.getInstance();

const server = http.createServer(app);

wsManager.init(server);

const cleanupTimer = startScheduledCleanup();

server.listen(port, () => {
  console.log(`HookCatcher server listening on port ${port}`);
});

process.on("SIGTERM", () => {
  clearInterval(cleanupTimer);
  server.close(() => {
    console.log("Server shut down gracefully.");
    process.exit(0);
  });
});
