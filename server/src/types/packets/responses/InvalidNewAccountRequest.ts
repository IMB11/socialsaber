import { WebsocketMessage } from "..";

export class InvalidNewAccountRequest extends WebsocketMessage {
  constructor() {
    super({
      id: "invalid-new-account-request",
    });
  }

  public async manageMessage(): Promise<void> {
    // This is a response message, it doesn't need to do anything.
    return;
  }
}