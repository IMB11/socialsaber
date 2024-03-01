import { WebsocketMessage } from "..";
import { WebsocketConnection } from "../../connection";


export class InvalidAuthenticationRequest extends WebsocketMessage {
  constructor(data: { reason: string }) {
    super({
      id: "invalid-authentication-request",
      ...data
    });
  }

  public override async manageMessage(connection: WebsocketConnection): Promise<void> {
    // This is a response message, it doesn't need to do anything.
    return;
  }
}