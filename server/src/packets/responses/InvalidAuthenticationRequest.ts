import { WebsocketMessage } from "..";


export class InvalidAuthenticationRequest extends WebsocketMessage {
  constructor(data: { reason: string }) {
    super({
      id: "invalid-authentication-request",
      ...data
    });
  }

  public async manageMessage(): Promise<void> {
    // This is a response message, it doesn't need to do anything.
    return;
  }
}