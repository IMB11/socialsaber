import { RawData, WebSocket } from "ws";
import { ClassBuilder } from "./types/classBuilders";
import { db } from "./db";

const connections: string[] = [];

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
    while (connections.includes(uniqueID)) {
      uniqueID = generateStringID();
    }
    connections.push(uniqueID);
    this.uniqueID = uniqueID;


    this.ws.on("message", (msg: RawData) => this.onMessage(msg));
    this.ws.on("close", () => this.onClose());
    this.ws.on("error", (err) => this.onError(err));

    this.log("Registered new connection.");
  }

  public getUserData(): any {
    if (this.userID === undefined) return undefined;
    return db.find("users", { id: this.userID });
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
  }

  private onError(error: Error) {
    this.log(`Error: ${error.message}`);
  }

}