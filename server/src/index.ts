import { RawData, WebSocket, WebSocketServer } from "ws";
import { createServer } from 'http';
import { ConnectionAcknowledge } from "./types/websocket";
import { WebsocketConnection } from "./connection";

const server = createServer();
const wss = new WebSocketServer({ server });

const connectionMap = new Map<string, WebsocketConnection>();

function handleInitialMessage(ws: WebSocket, message: RawData) {
  let msg = JSON.parse(message.toString());
  if (msg.id === 'connection-acknowledge') {
    ws.removeAllListeners('message');
    const connection = new WebsocketConnection(ws);
    connectionMap.set(connection.getUniqueID(), connection);
  }
}

function handleConnection(ws: WebSocket) {
  let ack = new ConnectionAcknowledge();
  ws.send(ack.toJSON());
  ws.addListener('message', (message) => handleInitialMessage(ws, message));
}

wss.addListener('connection', handleConnection);

server.listen(7070);