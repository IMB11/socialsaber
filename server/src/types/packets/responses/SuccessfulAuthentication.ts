import { WebsocketMessage } from "..";

export class SuccessfulAuthentication extends WebsocketMessage {
  constructor(data: { token: string }) {
    super({
      id: "successful-authentication",
      ...data
    });
  }

  public async manageMessage(): Promise<void> {
    // This is a response message, it doesn't need to do anything.
    return;
  }
}