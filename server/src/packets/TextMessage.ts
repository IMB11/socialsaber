import { WebsocketMessage } from ".";
import { users, tokens, messages } from "../db"

export class TextMessage extends WebsocketMessage {
  private readonly timestamp: Date;
  private readonly message: any;
  constructor(data: { message: string, token: string }) {
    super({
      id: "text-message",
      ...data
    });
    this.message = data.message;
    this.timestamp = new Date();
  }

  public async manageMessage(): Promise<void> {

    return;
  }
}