import { WebsocketConnection } from "../connection";
import { tokens } from "../db";
import { randomBytes } from "crypto"

interface WebsocketMessageData {
  id: string;
}

export async function generateToken(): Promise<string> {
  let isUnique = false;
  let token = "";
  while (!isUnique) {
    token = randomBytes(64).toString("hex");
    const existingToken = await tokens.findOne({ token });

    if (!existingToken) {
      isUnique = true;
    }
  }

  return token;
};

export abstract class WebsocketMessage {
  protected readonly data: WebsocketMessageData;

  constructor(data: WebsocketMessageData) {
    this.data = data;
  }

  public toJSON(): string {
    return JSON.stringify(this.data);
  }

  public getRawData(): WebsocketMessageData {
    return this.data;
  }

  public getID(): string {
    return this.data.id;
  }

  public abstract manageMessage(connection: WebsocketConnection): Promise<void>;
}