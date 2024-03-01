import { WebsocketConnection } from "../../connection";
import { messages } from "../../db"; // Assuming you have an interface for database results

interface WebsocketMessageData {
  id: string;
}

export abstract class WebsocketMessage {
  protected readonly data: WebsocketMessageData;

  constructor(data: WebsocketMessageData) {
    this.data = data;
  }

  public toJSON(): string {
    return JSON.stringify(this.data);
  }

  public getID(): string {
    return this.data.id;
  }

  public abstract manageMessage(connection: WebsocketConnection): Promise<void>;
}

export * from "./ConnectionAcknowledge";
export * from "./AuthenticationRequest";
export * from "./NewAccountRequest";
export * from "./responses/InvalidAuthenticationRequest";
export * from "./responses/InvalidNewAccountRequest";