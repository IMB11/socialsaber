import { LooseObject } from "trilogy";
import { WebsocketMessage } from ".";
import { WebsocketConnection, connections } from "../connection";
import { users, tokens, messages } from "../db"
import { GenericError } from "./responses/GenericError";

export class TextMessage extends WebsocketMessage {
  private readonly timestamp: Date;
  private readonly message: any;
  private messageID: number;
  private authorID: number;
  constructor(data: { message: string, messageID?: number, authorID?: number }) {
    super({
      id: "text-message",
      ...data,
    });
    this.message = data.message;
    this.timestamp = new Date();
    this.messageID = data.messageID ? data.messageID : -1;
    this.authorID = data.authorID ? data.authorID : -1;
  }

  public toJSON(): string {
    return JSON.stringify({
      ...this.getRawData(),
      messageID: this.messageID,
      timestamp: this.timestamp,
      authorID: this.authorID,
    });
  }

  public override async manageMessage(connection: WebsocketConnection): Promise<void> {
    try {
      const user = await connection.getUserData();

      console.log(user)

      if (!user) {
        throw new Error("Invalid user - you are unauthenticated.");
      }

      const message = await messages.create({ userID: user.id, message: this.message, timestamp: this.timestamp }) as LooseObject;
      this.messageID = message.id;
      this.authorID = user.id;

      connection.log(user.username + ": " + this.message);
      connection.send(this);

      connections.forEach((con: WebsocketConnection) => {
        if (con.getUniqueID() === connection.getUniqueID()) return;
        con.send(this);
      });
    } catch (error: any) {
      connection.log("Error in TextMessage: " + error.message);
      connection.send(new GenericError({ reason: error.message }));
      return;
    }
  }
}