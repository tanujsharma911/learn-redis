import { WebSocketServer, WebSocket } from "ws";
import http from "http";
import fs from "fs";
import path from "path";
import { Redis } from "ioredis";

const PORT = process.env.PORT || 3000;
const CHANNEL = "chat";

const pub = new Redis({
  host: "localhost",
  port: 6379,
});

const sub = new Redis({
  host: "localhost",
  port: 6379,
});

sub.subscribe(CHANNEL);

sub.on("message", (channel, message) => {
  if (channel === CHANNEL) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
});

const server = http.createServer(async (req, res) => {
  const indexFile = await fs.promises.readFile(
    path.resolve("./index.html"),
    "utf8",
  );
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(indexFile);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    pub.publish(CHANNEL, message.toString());
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is listening on ws://localhost:${PORT}`);
});
