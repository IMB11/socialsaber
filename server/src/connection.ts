import { RawData, WebSocket } from "ws";
import { ClassBuilder } from "./packetBuilder";
import { db, users } from "./db";
import { WebsocketMessage } from "./packets";

export const connections: Map<string, WebsocketConnection> = new Map();

function generateStringID(): string {
  return Math.random().toString(36).substring(2, 15);
}

export class WebsocketConnection {
  private ws: WebSocket;
  private uniqueID: string;
  private userID: string | undefined = undefined;

  constructor(ws: WebSocket) {
    this.ws = ws;

    // Register connection id with connections array.
    let uniqueID = generateStringID();
    while (connections.has(uniqueID)) {
      uniqueID = generateStringID();
    }
    connections.set(uniqueID, this);
    this.uniqueID = uniqueID;


    this.ws.on("message", (msg: RawData) => this.onMessage(msg));
    this.ws.on("close", () => this.onClose());
    this.ws.on("error", (err) => this.onError(err));

    this.log("Registered new connection.");
  }

  public async getUserData(): Promise<any> {
    if (this.userID === undefined) return undefined;
    return await users.findOne({ id: this.userID });
  }

  public getUniqueID(): string {
    return this.uniqueID;
  }

  public log(message: string) {
    console.log(`[Connection ${this.uniqueID}]: ${message}`);
  }

  public setUserID(id: string) {
    this.userID = id;
  }

  public send(message: WebsocketMessage) {
    if (this.ws === undefined) return;
    if (this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(message.toJSON());
  }

  private onMessage(message: RawData) {
    this.log(`Received message: ${message}`);
    const tryJSON = (str: string): any => {
      try {
        const obj = JSON.parse(str);
        return obj;
      } catch (e) {
        return undefined;
      }
    }

    const rawMessage = tryJSON(message.toString());
    if (rawMessage === undefined) return;
    if (rawMessage.id === undefined) return;

    const messageType = ClassBuilder.fetchClass(rawMessage.id, rawMessage);

    if (messageType === undefined) return;
    messageType.manageMessage(this);
  }

  private onClose() {
    this.log("Connection closed.");
    connections.delete(this.uniqueID);
  }

  private onError(error: Error) {
    this.log(`Error: ${error.message}`);
  }

}