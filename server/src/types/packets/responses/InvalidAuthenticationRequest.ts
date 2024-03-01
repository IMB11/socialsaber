import { WebsocketMessage } from "..";


export class InvalidAuthenticationRequest extends WebsocketMessage {
  constructor() {
    super({
      id: "invalid-authentication-request",
    });
  }

  public async manageMessage(): Promise<void> {
    // This is a response message, it doesn't need to do anything.
    return;
  }
}