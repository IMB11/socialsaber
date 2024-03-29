import { WebsocketMessage } from "..";
import { WebsocketConnection } from "../../connection";

export class SuccessfulAuthentication extends WebsocketMessage {
  constructor(data: { token: string }) {
    super({
      id: "successful-authentication",
      ...data
    });
  }

  public override async manageMessage(connection: WebsocketConnection): Promise<void> {
    // This is a response message, it doesn't need to do anything.
    return;
  }
}